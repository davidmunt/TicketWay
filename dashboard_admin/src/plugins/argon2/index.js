const fp = require("fastify-plugin");
const argon2 = require("argon2");

async function fastifyArgon2(fastify, options) {
  fastify.decorate("hash", async (password) => {
    return await argon2.hash(password);
  });

  fastify.decorate("hashCompare", async (password, hash) => {
    return await argon2.verify(hash, password);
  });
}

module.exports = fp(fastifyArgon2);
