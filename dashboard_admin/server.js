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
    console.log("Rutas registradas:");
    console.log(server.printRoutes());
  });

  server.setErrorHandler((err, req, res) => {
    req.log.error({ req, res, err }, err && err.message);
    err.message = "An error has occurred";
    res.send(err);
  });

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
