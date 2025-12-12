const asyncHandler = require("express-async-handler");
const axios = require("axios");

const payment = asyncHandler(async (req, res) => {
  try {
    const { payment, paymentIntentId } = req.body;
    const authHeader = req.authHeader;
    const userId = req.userId;
    if (!payment || !Array.isArray(payment.products) || payment.products.length === 0) {
      return res.status(400).json({ message: "Debes enviar al menos un producto con su cantidad" });
    }
    for (const item of payment.products) {
      item.productQty = Number(item.productQty);
      item.ticketsQty = Number(item.ticketsQty);
      if (
        typeof item.productQty !== "number" ||
        typeof item.ticketsQty !== "number" ||
        isNaN(item.productQty) ||
        isNaN(item.ticketsQty) ||
        item.productQty < 0 ||
        item.ticketsQty <= 0
      ) {
        return res.status(400).json({ message: "Cada producto debe tener un id válido y cantidad mayor a 0" });
      }
    }
    const response = await axios.post(
      "http://localhost:3003/api/payment",
      {
        payment,
        paymentIntentId,
        typePayment: payment.typePayment,
      },
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ message: "Error al intentar hacer pago", error: error.message, response: response.data });
  }
});

module.exports = {
  payment,
};
