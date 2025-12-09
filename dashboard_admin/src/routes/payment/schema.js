const S = require("fluent-json-schema").default;

const productItem = S.object()
  .prop("concert", S.string().minLength(1).required())
  .prop("ticketsQty", S.number().minimum(1).required())
  .prop("product", S.string().minLength(1).required())
  .prop("productQty", S.number().minimum(0).required());

const paymentBody = S.object()
  .prop("payment", S.object().prop("products", S.array().items(productItem).minItems(1).required()).required())
  .prop("paymentIntentId", S.string().minLength(1()));

const paymentResponse = S.object()
  .prop("success", S.boolean().default(true))
  .prop("paymentIntentId", S.string().required())
  .prop("clientSecret", S.string().required())
  .prop("orderId", S.string().required())
  .prop("reused", S.boolean());
const webhookResponse = S.object().prop("received", S.boolean().default(true));

module.exports = {
  createPayment: {
    description: "Crear o reintentar un pago con Stripe PaymentIntent",
    tags: ["Payment"],
    body: paymentBody,
    response: {
      200: paymentResponse,
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },
  webhookStripe: {
    description: "Webhook oficial de Stripe (requiere rawBody)",
    tags: ["Payment"],
    response: {
      200: webhookResponse,
      400: S.object().prop("message", S.string()),
    },
  },
};
