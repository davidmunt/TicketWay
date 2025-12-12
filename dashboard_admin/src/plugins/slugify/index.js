const fp = require("fastify-plugin");
const slugify = require("slugify");

async function fastifySlugify(fastify, options) {
  fastify.decorate("slugify", (text) => {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  });
}

module.exports = fp(fastifySlugify);
