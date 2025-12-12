const envSchema = require("env-schema");
const Schema = require("fluent-json-schema");

async function getConfig() {
  const env = envSchema({
    dotenv: true,
    schema: Schema.object()
      .prop("NODE_ENV", Schema.string().default("development"))
      .prop("API_HOST", Schema.string().default("http://localhost"))
      .prop("API_PORT", Schema.number().default(3003))
      .prop("API_PREFIX", Schema.string().default("/api"))
      .prop("LOG_LEVEL", Schema.string().enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"))
      .prop("DATABASE_URL", Schema.string().required())
      .prop("JWT_SECRET", Schema.string().required())
      .prop("JWT_EXPIRES_IN", Schema.string().default("15m"))
      .prop("JWT_REFRESH_SECRET", Schema.string().required())
      .prop("JWT_REFRESH_EXPIRES_IN", Schema.string().default("7d"))
      .prop("JWT_ISSUER", Schema.string().default("ticketway-api"))
      .prop("CORSURL", Schema.string().default("http://localhost:4200"))
      .prop("STRIPE_WEBHOOK_SECRET", Schema.string().default("whsec_"))
      .prop("STRIPE_SECRET_KEY", Schema.string().default("sk_test_")),
  });

  const config = {
    prefix: env.API_PREFIX,
    fastify: {
      host: env.API_HOST,
      port: env.API_PORT,
    },
    fastifyInit: {
      logger: {
        level: env.LOG_LEVEL,
        serializers: {
          req: (request) => ({
            method: request.raw.method,
            url: request.raw.url,
            hostname: request.hostname,
          }),
          res: (response) => ({
            statusCode: response.statusCode,
          }),
        },
      },
    },
    database: {
      url: env.DATABASE_URL,
    },
    security: {
      jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
        issuer: env.JWT_ISSUER,
      },
      refresh: {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      },
    },
    cors: {
      origin: env.CORSURL,
    },
    stripe: {
      webhookSecret: env.STRIPE_WEBHOOK_SECRET,
      secretKey: env.STRIPE_SECRET_KEY,
    },
  };

  return config;
}

module.exports = getConfig;
