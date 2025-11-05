module.exports = (app) => {
  const artists = require("../controllers/venue.controller.js");

  // GET all Venues
  app.get("/venues", artists.getAllVenues);

  // GET one Venue
  app.get("/venues/:slug", artists.getOneVenue);
};
