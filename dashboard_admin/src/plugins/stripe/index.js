const fp = require("fastify-plugin");
const { Stripe } = require("stripe");
const getConfig = require("../../config/config");

async function stripePlugin(server, options) {
  const config = await getConfig();
  const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2025-11-17.clover",
  });

  const stripeWrapper = {
    stripe,
    async createPaymentIntent({ amount, currency = "eur", metadata = {}, idempotencyKey }) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({ amount, currency, metadata }, idempotencyKey ? { idempotencyKey } : {});
        return paymentIntent;
      } catch (err) {
        console.error("Error creando PaymentIntent:", err);
        throw err;
      }
    },

    async retrievePaymentIntent(paymentIntentId) {
      return stripe.paymentIntents.retrieve(paymentIntentId);
    },

    async confirmPaymentIntent(paymentIntentId) {
      return stripe.paymentIntents.confirm(paymentIntentId);
    },

    verifyWebhook(req) {
      const signature = req.headers["stripe-signature"];
      console.log("=== Stripe webhook headers ===");
      console.log(req.headers);
      console.log("=== Stripe webhook rawBody ===");
      console.log(req.rawBody ? req.rawBody.toString() : "rawBody vacío");
      if (!signature) throw new Error("Stripe signature header missing");
      try {
        const event = stripe.webhooks.constructEvent(req.rawBody, signature, config.stripe.webhookSecret);
        console.log("✅ Webhook verificado correctamente");
        return event;
      } catch (err) {
        console.error("Error verificando webhook:", err);
        throw new Error("Webhook signature verification failed", err);
      }
    },
  };

  server.decorate("stripe", stripeWrapper);
}

module.exports = fp(stripePlugin);
