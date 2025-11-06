const fp = require("fastify-plugin");
const swagger = require("@fastify/swagger");
const swaggerUI = require("@fastify/swagger-ui");

module.exports = fp(async function (fastify) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "TicketWay - Dashboard Admin API",
        description: "Documentacion auto-generada con Swagger y Fluent JSON Schema",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3003", description: "Servidor local" }],
    },
  });
  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  fastify.log.info("Swagger y Swagger UI cargados en /docs");
});
