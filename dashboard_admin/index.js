const Fastify = require("fastify");
const getConfig = require("./src/config/config");
const appPlugin = require("./server");

(async () => {
  const config = await getConfig();
  const fastify = Fastify(config.fastifyInit);
  fastify.register(appPlugin, config);

  try {
    await fastify.listen({
      port: config.fastify.port,
      host: "0.0.0.0", // 🔥 CLAVE
    });
    console.log(`🚀 Server corriendo en 0.0.0.0:${config.fastify.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();

// const Fastify = require("fastify");
// const getConfig = require("./src/config/config");
// const appPlugin = require("./server");

// (async () => {
//   const config = await getConfig();
//   const fastify = Fastify(config.fastifyInit);
//   fastify.register(appPlugin, config);
//   try {
//     await fastify.listen({ port: config.fastify.port, host: config.fastify.host });
//     console.log(`Server corriendo en ${config.fastify.host}:${config.fastify.port}`);
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// })();
