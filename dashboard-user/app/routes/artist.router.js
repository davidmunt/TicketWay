module.exports = (app) => {
  const artists = require("../controllers/artist.controller.js");

  // Create a new Artist
  app.post("/artists", artists.createArtist);

  // GET all Artists
  app.get("/artists", artists.getAllArtists);

  // GET one Artist
  app.get("/artists/:slug", artists.getOneArtist);

  //Delete one Artist
  app.delete("/artists/:slug", artists.deleteArtist);
};
