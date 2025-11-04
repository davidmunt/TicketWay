const fp = require("fastify-plugin");
const { Unauthorized } = require("http-errors");

module.exports = fp(async function (fastify, opts) {
  const prisma = fastify.prisma;
  fastify.register(require("@fastify/jwt"), {
    secret: opts.security.jwt.secret,
    sign: {
      expiresIn: opts.security.jwt.expiresIn,
      issuer: opts.security.jwt.issuer,
    },
    verify: {
      extractToken: (req) => {
        const header = req.headers.authorization;
        return header ? header.replace(/^Token /, "") : null;
      },
    },
  });

  fastify.decorate("authenticate", async function (req, reply) {
    try {
      const token = req.headers.authorization?.replace(/^Token /, "");
      if (!token) throw new Unauthorized("Token necesario");
      const blacklisted = await prisma.refreshBlacklist.findUnique({
        where: { token },
      });
      if (blacklisted) throw new Unauthorized("Token revocado");
      const decoded = await req.jwtVerify();
      const user = await prisma.userAdmin.findUnique({
        where: { id: decoded?.userAdmin?.id },
      });
      if (!user) throw new Unauthorized("Usuario no encontrado");
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { userId: user.id },
      });
      if (!refreshToken) throw new Unauthorized("RefreshToken no encontrado");
      if (refreshToken.expiryDate < new Date()) {
        await prisma.refreshBlacklist.create({
          data: {
            token: refreshToken.token,
            userId: user.id,
            expiryDate: refreshToken.expiryDate,
          },
        });
        await prisma.refreshToken.delete({
          where: { id: refreshToken.id },
        });
        throw new Unauthorized("RefreshToken expirado");
      }
      req.userId = user.id;
      req.userEmail = user.email;
      req.token = token;
    } catch (err) {
      throw new Unauthorized("Token invalido o expirado");
    }
  });
});
