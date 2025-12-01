module.exports = (app) => {
  const verifyJWT = require("../middleware/verifyJWT");
  const cart = require("../controllers/cart.controller");

  //Add Concert to Cart
  app.post("/cart/:slug/", verifyJWT, cart.addConcertToCart);

  //GET Cart from user
  app.get("/cart/:slug/", verifyJWT, cart.getCartFromUser);

  //Modify Cant of Concert in Cart
  app.patch("/cart/:slug/concert/:concertId/", verifyJWT, cart.modifyConcertCartQty);

  //Modify Cant of Product in Cart
  app.patch("/cart/:slug/product/:productId/", verifyJWT, cart.modifyProductCartQty);

  //DELETE Concert from Cart
  app.delete("/cart/:slug/concert/:concertId/", verifyJWT, cart.deleteConcertFromCart);

  //DELETE Product from Cart
  app.delete("/cart/:slug/product/:productId/", verifyJWT, cart.deleteProductFromCart);
};
