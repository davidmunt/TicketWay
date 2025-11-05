const fp = require("fastify-plugin");
const schema = require("./schema");
const createError = require("http-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function user(server, options) {
  server.route({
    method: "PUT",
    url: options.prefix + "user/changeIsActice/:username",
    onRequest: [server.authenticate],
    schema: schema.changeIsActive,
    handler: onChangeIsActive,
  });
  async function onChangeIsActive(req, reply) {
    try {
      const isActive = req.body.user;
      const username = req.params.username;
      const user = await server.prisma.user.findUnique({
        where: { username: username },
      });
      if (!user) {
        return reply.code(404).send({ message: "El usuario con ese nombre no ha sido encontrado" });
      }
      await server.prisma.user.update({
        where: { username: username },
        data: { isActive: isActive },
      });
      return reply.send({
        success: true,
        message: "IsActive del usuario cambiado correctamente",
      });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }

  server.route({
    method: "GET",
    url: options.prefix + "users",
    schema: schema.getUsers,
    onRequest: [server.authenticate],
    handler: onGetUsers,
  });
  async function onGetUsers(req, reply) {
    try {
      const users = await server.prisma.user.find();
      if (users) delete users.password;
      return { users: users };
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }
}

module.exports = fp(user);
