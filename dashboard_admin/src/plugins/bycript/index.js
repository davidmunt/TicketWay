const fp = require("fastify-plugin");
const bcrypt = require("bcrypt");

function fastifyBcrypt(fastify, options, next) {
  try {
    fastify.decorate("hash", async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    });
    fastify.decorate("hashCompare", async (password, hash) => {
      return await bcrypt.compare(password, hash);
    });

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = fp(fastifyBcrypt);
