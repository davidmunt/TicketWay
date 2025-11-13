const fp = require("fastify-plugin");
const { PrismaClient } = require("@prisma/client");

module.exports = fp(async (fastify) => {
  const prisma = new PrismaClient();
  fastify.decorate("prisma", prisma);
});
