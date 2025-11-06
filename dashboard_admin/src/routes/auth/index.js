const fp = require("fastify-plugin");
const schema = require("./schema");
const createError = require("http-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userAdminModel = require("../../models/auth")();
const getConfig = require("../../config/config");

function parseDuration(duration) {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 0;
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[unit];
}

async function userAdmin(server, options) {
  const config = await getConfig();
  server.route({
    method: "POST",
    url: options.prefix + "auth/register",
    schema: schema.register,
    handler: onAdminRegister,
  });
  async function onAdminRegister(req, reply) {
    try {
      const { username, email, password } = req.body.user;
      const existingUsername = await userAdminModel.getUserAdminCompanyByUsername(username);
      if (existingUsername) {
        return reply.code(409).send({ message: "El nombre de usuario ya esta en uso" });
      }
      const existingEmail = await userAdminModel.getUserAdminCompanyByEmail(email);
      if (existingEmail) {
        return reply.code(409).send({ message: "El correo electrónico ya esta en uso" });
      }
      req.body.user.password = await server.hash(password);
      const user = await userAdminModel.registerUserAdmin(req.body.user);
      if (user) delete user.password;
      const accessToken = server.jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: config.security.jwt.expiresIn }
      );
      const refreshToken = server.jwt.sign(
        { userId: user.id },
        { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: config.security.refresh.expiresIn }
      );
      await server.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiryDate: new Date(Date.now() + parseDuration(config.security.refresh.expiresIn)),
        },
      });
      return reply.send({
        user: user,
        accessToken,
      });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }

  server.route({
    method: "POST",
    url: options.prefix + "auth/login",
    schema: schema.login,
    handler: onAdminLogin,
  });
  async function onAdminLogin(req, reply) {
    try {
      const { email, password } = req.body.user;
      const userLogin = await userAdminModel.getUserAdminByEmail(email);
      if (!isUndefined(userLogin)) {
        if (await server.hashCompare(password, userLogin.password)) {
          if (userLogin) delete userLogin.password;
          const accessToken = server.jwt.sign(
            { userId: userLogin.id, email: userLogin.email },
            { expiresIn: config.security.jwt.expiresIn }
          );
          const refreshToken = server.jwt.sign(
            { userId: userLogin.id },
            {
              secret: process.env.REFRESH_TOKEN_SECRET,
              expiresIn: config.security.refresh.expiresIn,
            }
          );
          await server.prisma.refreshToken.create({
            data: {
              token: refreshToken,
              userId: userLogin.id,
              expiryDate: new Date(Date.now() + parseDuration(config.security.refresh.expiresIn)),
            },
          });
          return reply.send({
            user: userLogin,
            accessToken,
          });
        }
        return createError.Unauthorized("Datos incorrectos");
      }
    } catch (error) {
      return reply.code(409).send({ message: "Ha habido un error" });
    }
  }

  server.route({
    method: "POST",
    url: options.prefix + "auth/refreshToken",
    schema: schema.refreshToken,
    onRequest: [server.authenticate],
    handler: onRefreshToken,
  });
  async function onRefreshToken(req, reply) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return reply.code(400).send({ message: "Refresh token requerido" });
      const blacklisted = await server.prisma.refreshBlacklist.findUnique({
        where: { token: refreshToken },
      });
      if (blacklisted) return reply.code(403).send({ message: "Refresh token revocado" });
      const storedToken = await server.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!storedToken) return reply.code(403).send({ message: "Refresh token no encontrado" });
      if (storedToken.expiryDate < new Date()) {
        await server.prisma.refreshToken.delete({ where: { id: storedToken.id } });
        return reply.code(403).send({ message: "Refresh token expirado" });
      }
      const decoded = server.jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await server.prisma.userAdmin.findUnique({ where: { id: decoded.userId } });
      if (!user) return reply.code(404).send({ message: "Usuario no encontrado" });
      const newAccessToken = server.jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: config.security.jwt.expiresIn }
      );
      return reply.send({ accessToken: newAccessToken });
    } catch (error) {
      return reply.code(500).send({ message: "Error al refrescar token" });
    }
  }

  server.route({
    method: "GET",
    url: options.prefix + "userAdmin/data",
    schema: schema.userAdminData,
    onRequest: [server.authenticate],
    handler: onUserAdminData,
  });
  async function onUserAdminData(req, reply) {
    try {
      const userId = req.userId;
      const user = await server.prisma.userAdmin.findUnique({ where: { id: userId } });
      if (!user) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      if (user) delete user.password;
      return { userAdmin: user };
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }
}

module.exports = fp(userAdmin);
