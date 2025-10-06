module.exports = (app) => {
  const artists = require("../controllers/venue.controller.js");

  // Create a new Venue
  app.post("/venues", artists.createVenue);

  // GET all Venues
  app.get("/venues", artists.getAllVenues);

  // GET one Venue
  app.get("/venues/:slug", artists.getOneVenue);

  //Delete one Venue
  app.delete("/venues/:slug", artists.deleteVenue);
};
