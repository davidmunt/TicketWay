const fp = require("fastify-plugin");
const { Unauthorized } = require("http-errors");

module.exports = fp(async function (fastify, opts) {
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
      const token = req.headers?.authorization?.replace(/^Token /, "");
      if (!token) throw new Unauthorized("El Token es necesario");
      let decoded;
      try {
        decoded = fastify.jwt.verify(token);
      } catch (err) {
        throw new Unauthorized("Token invalido o expirado");
      }
      if (decoded.typeUser !== "admin") {
        throw new Unauthorized("Tipo de usuario no autorizado");
      }
      const user = await fastify.prisma.userAdmin.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) throw new Unauthorized("Usuario no encontrado");
      const refreshToken = await fastify.prisma.refreshToken.findFirst({
        where: { userId: user.id },
      });
      if (!refreshToken) {
        throw new Unauthorized("RefreshToken no encontrado, por favor vuelve a iniciar sesión");
      }
      if (refreshToken.expiryDate < new Date()) {
        await fastify.prisma.refreshBlacklist.create({
          data: {
            token: refreshToken.token,
            userId: user.id,
            expiryDate: refreshToken.expiryDate,
          },
        });
        await fastify.prisma.refreshToken.delete({
          where: { id: refreshToken.id },
        });
        throw new Unauthorized("Sesión expirada, por favor inicia sesión de nuevo");
      }
      req.userId = user.id;
      req.userEmail = user.email;
    } catch (err) {
      throw new Unauthorized(err.message || "Token invalido o expirado");
    }
  });

  fastify.decorate("authenticateUser", async function (req, reply) {
    try {
      const token = req.headers?.authorization?.replace(/^Token /, "");
      if (!token) throw new Unauthorized("El Token es necesario");
      let decoded;
      try {
        decoded = fastify.jwt.verify(token);
      } catch (err) {
        throw new Unauthorized("Token invalido o expirado");
      }
      if (decoded.typeUser !== "user") {
        throw new Unauthorized("Tipo de usuario no autorizado");
      }
      const user = await fastify.prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) throw new Unauthorized("Usuario no encontrado");
      const refreshToken = await fastify.prisma.refreshToken.findFirst({
        where: { userId: user.id },
      });
      if (!refreshToken) {
        throw new Unauthorized("RefreshToken no encontrado, por favor vuelve a iniciar sesión");
      }
      if (refreshToken.expiryDate < new Date()) {
        await fastify.prisma.refreshBlacklist.create({
          data: {
            token: refreshToken.token,
            userId: user.id,
            expiryDate: refreshToken.expiryDate,
          },
        });
        await fastify.prisma.refreshToken.delete({
          where: { id: refreshToken.id },
        });
        throw new Unauthorized("Sesión expirada, por favor inicia sesión de nuevo");
      }
      req.userId = user.id;
      req.userEmail = user.email;
    } catch (err) {
      throw new Unauthorized(err.message || "Token invalido o expirado");
    }
  });
});
