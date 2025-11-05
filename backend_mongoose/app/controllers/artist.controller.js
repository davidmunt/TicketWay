const Artist = require("../models/artist.model.js");

const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    return res.status(200).json(
      await Promise.all(
        artists.map(async (cat) => {
          return await cat.toArtistResponse();
        })
      )
    );
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener Artistas", error: error.message });
  }
};

const getOneArtist = async (req, res) => {
  try {
    const { slug } = req.params;
    const artist = await Artist.findOne({ slug }).exec();
    if (!artist) {
      return res.status(404).json({ message: "Artista no encontrada" });
    }
    return res.status(200).json(await artist.toArtistResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la Artista", error: error.message });
  }
};

module.exports = {
  getAllArtists,
  getOneArtist,
};
