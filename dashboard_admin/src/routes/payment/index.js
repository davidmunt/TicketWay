const fp = require("fastify-plugin");
const schema = require("./schema");

async function payment(server, options) {
  server.post(
    options.prefix + "payment",
    {
      schema: schema.createPayment,
      onRequest: [server.authenticateUser],
    },
    onCreatePayment
  );
  async function calculateTotal(server, items) {
    let total = 0;
    for (const item of items) {
      const concert = await server.prisma.concert.findUnique({
        where: { id: item.concert },
      });
      if (!concert) throw new Error("Concierto no encontrado");
      total += concert.price * item.ticketsQty;
      const product = await server.prisma.product.findUnique({
        where: { id: item.product },
      });
      if (!product) throw new Error("Producto no encontrado");
      total += product.price * item.productQty;
    }
    return total * 100;
  }

  async function createOrderAndReserveStock(server, userId, items) {
    return server.prisma.$transaction(async (tx) => {
      const order = await tx.ticketOrder.create({
        data: {
          user: userId,
          totalAmount: 0,
          status: "PENDING",
        },
      });
      for (const item of items) {
        const concert = await tx.concert.findUnique({
          where: { id: item.concert },
        });
        if (!concert) throw new Error("Concierto no encontrado");
        const product = await tx.product.findUnique({
          where: { id: item.product },
        });
        if (!product) throw new Error("Producto no encontrado");
        if (product.stockAvailable < item.productQty) {
          throw new Error(`Stock insuficiente para el producto ${product.name}`);
        }
        await tx.product.update({
          where: { id: item.product },
          data: { stockAvailable: { decrement: item.productQty } },
        });
        await tx.orderItem.create({
          data: {
            order: order.id,
            concert: concert.id,
            quantity: item.ticketsQty,
            unitPrice: concert.price,
            subtotal: concert.price * item.ticketsQty,
          },
        });
        await tx.orderProductItem.create({
          data: {
            order: order.id,
            product: product.id,
            quantity: item.productQty,
            unitPrice: product.price,
            subtotal: product.price * item.productQty,
          },
        });
      }
      return order;
    });
  }

  async function onCreatePayment(req, reply) {
    try {
      const userId = req.userId;
      const { payment, paymentIntentId, typePayment } = req.body;
      if (!payment || !Array.isArray(payment.products) || payment.products.length === 0) {
        return reply.code(400).send({ message: "Productos requeridos", success: false });
      }
      const order = await createOrderAndReserveStock(server, userId, payment.products);
      const amount = await calculateTotal(server, payment.products);
      const idempotencyKey = `order-${order.id}`;
      let paymentIntent;
      if (paymentIntentId) {
        try {
          paymentIntent = await server.stripe.paymentIntents.update(paymentIntentId, {
            amount,
            metadata: { orderId: order.id, userId },
          });
        } catch (err) {
          console.warn("⚠️ No se pudo actualizar paymentIntent. Creando uno nuevo...");
          paymentIntent = await server.stripe.createPaymentIntent({
            amount,
            currency: "eur",
            idempotencyKey,
            metadata: {
              orderId: order.id,
              userId,
              typePayment: typePayment,
            },
          });
        }
      } else {
        paymentIntent = await server.stripe.createPaymentIntent({
          amount,
          currency: "eur",
          idempotencyKey,
          metadata: {
            orderId: order.id,
            userId,
            typePayment: typePayment,
          },
        });
      }
      await server.prisma.payment.upsert({
        where: { transactionRef: paymentIntent.id },
        create: {
          order: order.id,
          amount: amount / 100,
          method: "STRIPE",
          transactionRef: paymentIntent.id,
          currency: "EUR",
          status: "PENDING",
        },
        update: {
          amount: amount / 100,
        },
      });
      return reply.send({
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        reused: Boolean(paymentIntentId),
      });
    } catch (err) {
      console.error("🔥 ERROR CREATE PAYMENT:", err);
      return reply.code(500).send({ success: false, message: err.message });
    }
  }

  server.post(
    options.prefix + "webhook/stripe",
    {
      config: { rawBody: true },
    },
    async (req, reply) => {
      console.log("Llama a func de webhook");
      let event;
      try {
        event = server.stripe.verifyWebhook(req);
      } catch (err) {
        console.error("❌ Error verificando webhook:", err.message);
        return reply.code(400).send(`Webhook Error: ${err.message}`);
      }
      const data = event.data.object;
      const type = event.type;
      if (type === "payment_intent.succeeded") {
        console.log("payment_intent.succeeded es true");
        const paymentIntentId = data.id;
        const orderId = data.metadata.orderId;
        const userId = data.metadata.userId;
        const typePayment = data.metadata.typePayment;
        console.log("typePayment", typePayment);
        try {
          await server.prisma.$transaction(async (tx) => {
            await tx.ticketOrder.update({
              where: { id: orderId },
              data: { status: "PAID" },
            });
            if (typePayment === "cart") {
              console.log("typePayment === cart");
              await tx.cart.updateMany({
                where: { owner: userId, isActive: true },
                data: { status: "FINISHED", isActive: false },
              });
              function generateCartSlug(username, slugifyFn) {
                const randomStr = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
                if (username) {
                  return `${slugifyFn(username)}-${randomStr}`;
                }
                return `cart-${randomStr}`;
              }
              const user = await tx.user.findUnique({ where: { id: userId } });
              const newCart = await tx.cart.create({
                data: {
                  owner: userId,
                  slug: generateCartSlug(user?.username, server.slugify),
                  concerts: [],
                  isActive: true,
                  status: "ACTIVE",
                },
              });
              await tx.user.update({
                where: { id: userId },
                data: { cartSlug: newCart.slug },
              });
            }
            await tx.payment.updateMany({
              where: { transactionRef: paymentIntentId },
              data: { status: "COMPLETED" },
            });
            const [tickets, merch] = await Promise.all([
              tx.orderItem.findMany({ where: { order: orderId } }),
              tx.orderProductItem.findMany({ where: { order: orderId } }),
            ]);
            for (const item of tickets) {
              for (let i = 0; i < item.quantity; i++) {
                await tx.ticket.create({
                  data: {
                    user: userId,
                    orderItem: item.id,
                    concert: item.concert,
                    uniqueCode: `${item.order}-${item.id}-${i}-${Date.now()}`,
                  },
                });
              }
              await tx.concert.update({
                where: { id: item.concert },
                data: {
                  availableSeats: { decrement: item.quantity },
                },
              });
            }
            for (const m of merch) {
              await tx.product.update({
                where: { id: m.product },
                data: {
                  stockAvailable: { decrement: m.quantity },
                },
              });
            }
          });
        } catch (err) {
          console.error("❌ Error procesando webhook:", err);
        }
      }
      if (type === "payment_intent.payment_failed") {
        const paymentIntentId = data.id;
        await server.prisma.payment.updateMany({
          where: { transactionRef: paymentIntentId },
          data: { status: "FAILED" },
        });
        console.warn("⚠️ Pago fallido:", paymentIntentId);
      }
      reply.send({ received: true });
    }
  );
}

module.exports = fp(payment);
