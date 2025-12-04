module.exports = (app) => {
  const product = require("../controllers/product.controller.js");

  // GET one product
  app.get("/product/:productId", product.getOneProduct);
};
