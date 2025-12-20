const asyncHandler = require("express-async-handler");
const axios = require("axios");

const payment = asyncHandler(async (req, res) => {
  try {
    const { payment, paymentIntentId } = req.body;
    const authHeader = req.headers.authorization;
    if (!payment || !Array.isArray(payment.products) || payment.products.length === 0) {
      return res.status(400).json({ message: "Debes enviar al menos un producto" });
    }
    for (const item of payment.products) {
      item.productQty = Number(item.productQty);
      item.ticketsQty = Number(item.ticketsQty);
      if (isNaN(item.productQty) || isNaN(item.ticketsQty) || item.productQty < 0 || item.ticketsQty <= 0) {
        return res.status(400).json({ message: "Cantidades inválidas" });
      }
    }
    const response = await axios.post(
      "http://dashboard_admin:3003/api/payment",
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
    return res.status(201).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({
      message: "Error al intentar hacer pago",
      error: error.message,
    });
  }
});

module.exports = {
  payment,
};
