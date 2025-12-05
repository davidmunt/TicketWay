// const fp = require("fastify-plugin");
// const schema = require("./schema");

// async function payment(server, options) {
//   server.route({
//     method: "POST",
//     url: options.prefix + "payment",
//     schema: schema.createPayment,
//     onRequest: [server.authenticateUser],
//     handler: onCreatePayment,
//   });

//   async function onCreatePayment(req, reply) {
//     try {
//       const userId = req.userId;
//       const { payment, paymentIntentId } = req.body;
//       if (!payment || !Array.isArray(payment.products) || payment.products.length === 0) {
//         return reply.code(400).send({
//           message: "Los productos son obligatorios",
//           success: false,
//         });
//       }
//       for (const product of payment.products) {
//         if (!product.id || typeof product.quantity !== "number" || product.quantity <= 0) {
//           return reply.code(400).send({
//             message: "Cada producto debe tener un 'id' y una 'quantity' mayor que 0",
//             success: false,
//           });
//         }
//       }
//       const amount = calculateTotal(payment.products);
//       const currency = "eur";
//       let paymentIntent;
//       if (paymentIntentId) {
//         try {
//           paymentIntent = await server.stripe.retrievePaymentIntent(paymentIntentId);
//           if (paymentIntent.status === "succeeded") {
//             return reply.code(200).send({
//               success: true,
//               message: "El pago ya fue completado",
//               paymentIntentId,
//               clientSecret: paymentIntent.client_secret,
//             });
//           }
//         } catch (err) {
//           paymentIntent = null;
//         }
//       }
//       if (!paymentIntent) {
//         paymentIntent = await server.stripe.createPaymentIntent({
//           amount,
//           currency,
//           metadata: {
//             userId,
//             products: JSON.stringify(payment.products),
//           },
//         });
//       }
//       //hacer aqui el tema de orders y tokcets
//       return reply.code(200).send({
//         success: true,
//         message: "PaymentIntent creado correctamente",
//         paymentIntentId: paymentIntent.id,
//         clientSecret: paymentIntent.client_secret,
//       });
//     } catch (error) {
//       return reply.code(500).send({
//         message: `Ha ocurrido un error interno: ${error.message}`,
//         success: false,
//       });
//     }
//   }
// }

// module.exports = fp(payment);
