require("dotenv").config();
const Fastify = require("fastify");
const userRoutes = require("./src/routes/user");
const cors = require("@fastify/cors");

const fastify = Fastify({ logger: true });

fastify.register(userRoutes);

const PORT = process.env.PORT || 3003;

fastify.register(cors, {
  origin: process.env.CORSURL,
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
