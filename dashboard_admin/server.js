const path = require("path");
const fp = require("fastify-plugin");
const autoLoad = require("@fastify/autoload");
const cors = require("@fastify/cors");
const getConfig = require("./src/config/config.js");

async function plugin(server, config) {
  const appConfig = await getConfig();

  server
    .register(cors, {
      origin: appConfig.cors.origin,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
    .register(autoLoad, {
      dir: path.join(__dirname, "src", "plugins"),
      options: config,
    })
    .register(autoLoad, {
      dir: path.join(__dirname, "src", "services"),
      options: config,
    })
    .register(autoLoad, {
      dir: path.join(__dirname, "src", "routes"),
      options: config,
      dirNameRoutePrefix: false,
    });
  server.ready((err) => {
    if (err) throw err;
  });

  server.setErrorHandler((err, req, reply) => {
    req.log.error(err);
    const statusCode = err.statusCode || 500;
    reply.code(statusCode).send({
      message: err.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  });

  server.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    function (req, body, done) {
      if (!body) return done(null, {});
      try {
        const json = JSON.parse(body);
        done(null, json);
      } catch (err) {
        err.statusCode = 400;
        done(err, undefined);
      }
    }
  );

  // POST sin body
  server.addHook("onRequest", async (req, res) => {
    if (
      req.headers["content-type"] === "application/json" &&
      req.headers["content-length"] === "0"
    ) {
      req.headers["content-type"] = "empty";
    }
  });

  server.addContentTypeParser("empty", (request, body, done) => {
    done(null, {});
  });
}

module.exports = fp(plugin);
