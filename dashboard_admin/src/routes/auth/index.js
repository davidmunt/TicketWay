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
        { userId: user.id, email: user.email, typeUser: "admin" },
        { expiresIn: config.security.jwt.expiresIn }
      );
      const refreshToken = server.jwt.sign(
        { userId: user.id, email: user.email, typeuser: "admin" },
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
      if (!userLogin) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      const isPasswordValid = await server.hashCompare(password, userLogin.password);
      if (!isPasswordValid) {
        return reply.code(401).send({ message: "Credenciales incorrectas" });
      }
      delete userLogin.password;
      const accessToken = server.jwt.sign(
        { userId: userLogin.id, email: userLogin.email, typeUser: "admin" },
        { expiresIn: config.security.jwt.expiresIn }
      );
      const refreshToken = server.jwt.sign(
        { userId: userLogin.id, email: userLogin.email, typeUser: "admin" },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: config.security.refresh.expiresIn,
        }
      );
      await server.prisma.refreshToken.deleteMany({
        where: { userId: userLogin.id },
      });
      await server.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: userLogin.id,
          expiryDate: new Date(Date.now() + parseDuration(config.security.refresh.expiresIn)),
        },
      });
      return reply.code(200).send({
        user: userLogin,
        accessToken,
      });
    } catch (error) {
      return reply.code(500).send({
        message: "Ha habido un error en el login",
        error: error.message,
        success: false,
      });
    }
  }

  server.route({
    method: "POST",
    url: options.prefix + "auth/refreshToken",
    schema: schema.refreshToken,
    handler: onRefreshToken,
  });

  async function onRefreshToken(req, reply) {
    try {
      const token = req.headers?.authorization?.replace(/^Token\s+/, "");
      if (!token) {
        return reply.code(400).send({ message: "El token es necesario" });
      }
      let decoded;
      try {
        decoded = server.jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      } catch (err) {
        return reply.code(498).send({ message: "Refresh token inválido o expirado" });
      }
      const userId = decoded.userId;
      if (!userId) {
        return reply.code(400).send({ message: "El token no contiene un userId válido" });
      }
      const storedToken = await server.prisma.refreshToken.findUnique({
        where: { userId },
      });
      if (!storedToken) {
        return reply.code(403).send({ message: "Refresh token no encontrado" });
      }
      if (storedToken.token !== token) {
        return reply.code(403).send({ message: "El refresh token no coincide" });
      }
      const user = await server.prisma.userAdmin.findUnique({ where: { id: userId } });
      if (!user) {
        return reply.code(404).send({ message: "Usuario no encontrado" });
      }
      const newAccessToken = server.jwt.sign(
        { userId: user.id, email: user.email, typeUser: "admin" },
        { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
      );
      return reply.code(200).send({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return reply.code(500).send({
        message: "Error al refrescar token",
        error: error.message,
      });
    }
  }

  server.route({
    method: "POST",
    url: options.prefix + "auth/logout",
    schema: schema.refreshToken,
    onRequest: [server.authenticate],
    handler: onRefreshToken,
  });
  async function onRefreshToken(req, reply) {
    try {
      const userId = req.userId;
      const storedToken = await server.prisma.refreshToken.findUnique({
        where: { userId: userId },
      });
      if (!storedToken) return reply.code(403).send({ message: "Refresh token no encontrado" });
      const user = await server.prisma.userAdmin.findUnique({ where: { id: userId } });
      if (!user) return reply.code(404).send({ message: "Usuario no encontrado" });
      await server.prisma.refreshBlacklist.create({
        data: {
          token: storedToken.token,
          userId: user.id,
          expiryDate: storedToken.expiryDate,
        },
      });
      await server.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      return reply.send({ message: "Logout hecho correctamente" });
    } catch (error) {
      return reply.code(500).send({ message: "Error al refrescar token", error: error.message });
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
      return { user: user };
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }
}

module.exports = fp(userAdmin);
