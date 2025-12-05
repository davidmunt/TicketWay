const fp = require("fastify-plugin");
const schema = require("./schema");
const createError = require("http-errors");

async function user(server, options) {
  server.route({
    method: "PUT",
    url: options.prefix + "user/changeIsActive/:username",
    onRequest: [server.authenticate],
    schema: schema.changeIsActive,
    handler: onChangeIsActive,
  });
  async function onChangeIsActive(req, reply) {
    try {
      const { isActive } = req.body;
      const username = req.params.username;
      const user = await server.prisma.user.findUnique({
        where: { username },
      });
      if (!user) {
        return reply.code(404).send({ message: "El usuario con ese nombre no ha sido encontrado", success: false });
      }
      await server.prisma.user.update({
        where: { username },
        data: { isActive },
      });
      return reply.send({
        success: true,
        message: "IsActive del usuario cambiado correctamente",
      });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error", success: false });
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
      const users = await server.prisma.user.findMany();
      const cleanUsers = users.map(({ password, ...rest }) => rest);
      return reply.send({ users: cleanUsers });
    } catch (err) {
      return reply.code(500).send({
        message: "Error al obtener usuarios",
        error: err.message,
      });
    }
  }
}

module.exports = fp(user);
