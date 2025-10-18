module.exports = (app) => {
  const concerts = require("../controllers/concert.controller.js");
  const verifyJWT = require("../middleware/verifyJWT");
  const verifyJWTOptional = require("../middleware/verifyJWTOptional.js");

  // GET all Concerts
  app.get("/concerts", verifyJWTOptional, concerts.getAllConcerts);

  // GET one Concert
  app.get("/concerts/:slug", verifyJWTOptional, concerts.getOneConcert);

  // GET Concerts by One Category
  app.get("/concerts/category/:slug", concerts.getAllConcertsFromCategory);

  // Create a new Concert
  app.post("/concerts", concerts.createConcert);

  //Delete a Concert
  app.delete("/concerts/:slug", concerts.deleteOneConcert);

  //Favorite Concert
  app.post("/concerts/favorite/:slug", verifyJWT, concerts.favoriteConcert);

  //Unfavorite Concert
  app.delete("/concerts/favorite/:slug", verifyJWT, concerts.unfavoriteConcert);
};
