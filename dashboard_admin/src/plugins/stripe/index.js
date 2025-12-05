// const fp = require("fastify-plugin");
// const Stripe = require("stripe");
// const getConfig = require("../../config/config");

// async function stripePlugin(server, options) {
//   const config = await getConfig();
//   const stripe = Stripe(config.stripe.secretKey);

//   const stripeWrapper = {
//     stripe,
//     async createPaymentIntent({ amount, currency = "usd", metadata = {}, idempotencyKey }) {
//       try {
//         const paymentIntent = await stripe.paymentIntents.create({ amount, currency, metadata }, idempotencyKey ? { idempotencyKey } : {});
//         return paymentIntent;
//       } catch (err) {
//         console.error("Error creando PaymentIntent:", err);
//         throw err;
//       }
//     },

//     async retrievePaymentIntent(paymentIntentId) {
//       return stripe.paymentIntents.retrieve(paymentIntentId);
//     },
//     async confirmPaymentIntent(paymentIntentId) {
//       return stripe.paymentIntents.confirm(paymentIntentId);
//     },

//     verifyWebhook(req) {
//       const signature = req.headers["stripe-signature"];
//       if (!signature) throw new Error("Stripe signature header missing");
//       try {
//         const event = stripe.webhooks.constructEvent(req.rawBody, signature, config.stripe.webhookSecret);
//         return event;
//       } catch (err) {
//         console.error("Error verificando webhook:", err);
//         throw new Error("Webhook signature verification failed");
//       }
//     },
//   };
//   server.decorate("stripe", stripeWrapper);
// }

// module.exports = fp(stripePlugin);
