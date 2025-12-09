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
      const { payment, paymentIntentId } = req.body;
      if (!payment || !Array.isArray(payment.products) || payment.products.length === 0) {
        return reply.code(400).send({ message: "Productos requeridos", success: false });
      }
      // 1. Crear order + stock reservado
      const order = await createOrderAndReserveStock(server, userId, payment.products);
      // 2. Calcular total
      const amount = await calculateTotal(server, payment.products);
      const idempotencyKey = `order-${order.id}`;
      let paymentIntent;
      // 3. Si el front manda paymentIntentId → reintento
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
            },
          });
        }
      } else {
        // 4. Crear uno nuevo
        paymentIntent = await server.stripe.createPaymentIntent({
          amount,
          currency: "eur",
          idempotencyKey,
          metadata: {
            orderId: order.id,
            userId,
          },
        });
      }
      // 5. Registrar pago en base de datos
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
      // 6. Devolver al frontend
      return reply.send({
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
        reused: Boolean(paymentIntentId), // opcional
      });
    } catch (err) {
      console.error("🔥 ERROR CREATE PAYMENT:", err);
      return reply.code(500).send({ success: false, message: err.message });
    }
  }

  server.post(
    options.prefix + "webhook/stripe",
    {
      schema: schema.webhookStripe,
      config: { rawBody: true },
    },
    async (req, reply) => {
      let event;
      try {
        event = server.stripe.verifyWebhook(req);
      } catch (err) {
        console.error("❌ Webhook inválido:", err.message);
        return reply.code(400).send({ error: "Invalid signature" });
      }
      const data = event.data.object;
      const type = event.type;
      if (type === "payment_intent.succeeded") {
        const paymentIntentId = data.id;
        const orderId = data.metadata.orderId;
        const userId = data.metadata.userId;
        try {
          await server.prisma.$transaction(async (tx) => {
            await tx.ticketOrder.update({
              where: { id: orderId },
              data: { status: "PAID" },
            });
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
                    qr: `${orderId}-${item.id}-${i}-${Date.now()}`,
                    isValidated: false,
                  },
                });
              }
            }
          });
          console.log(`✔️ Pago completado. Orden ${orderId} confirmada.`);
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
