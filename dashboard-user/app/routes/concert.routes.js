module.exports = (app) => {
  const concerts = require("../controllers/concert.controller.js");

  // GET all Concerts
  app.get("/concerts", concerts.getAllConcerts);

  // GET one Concert
  app.get("/concerts/:slug", concerts.getOneConcert);

  // Create a new Concert
  app.post("/concerts", concerts.createConcert);

  //Delete a Concert
  app.delete("/concerts/:slug", concerts.deleteOneConcert);
};
