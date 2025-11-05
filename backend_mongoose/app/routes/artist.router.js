module.exports = (app) => {
  const artists = require("../controllers/artist.controller.js");

  // GET all Artists
  app.get("/artists", artists.getAllArtists);

  // GET one Artist
  app.get("/artists/:slug", artists.getOneArtist);
};
