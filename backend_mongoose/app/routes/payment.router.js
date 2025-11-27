module.exports = (app) => {
  const paymentController = require("../controllers/payment.controller.js");
  const verifyJWT = require("../middleware/verifyJWT");

  // llamar AXIOS peticion pago
  app.post("/payment/", verifyJWT, paymentController.payment);
};
