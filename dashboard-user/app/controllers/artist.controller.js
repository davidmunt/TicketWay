const Artist = require("../models/artist.model.js");
const Category = require("../models/category.model.js");

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

const createArtist = async (req, res) => {
  try {
    const { name, nationality, description, images, categories } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre del Artista es obligatorio" });
    }
    const categorias = await Category.find({ _id: { $in: categories } });
    if (categorias.length !== categories.length) {
      return res.status(400).json({ message: "Alguna de las categorias no existe" });
    }
    const newArtist = new Artist({
      name,
      nationality,
      description,
      images,
      categories,
    });
    await newArtist.save();
    await Promise.all(categorias.map((cat) => cat.addArtist(newArtist._id)));
    return res.status(201).json({
      artist: newArtist.toArtistResponse(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el Artista", error: error.message });
  }
};

const deleteArtist = async (req, res) => {
  try {
    const { slug } = req.params;
    const artist = await Artist.findOne({ slug }).exec();
    if (!artist) {
      return res.status(404).json({ message: "Artista no encontrado" });
    }
    const categorias = await Category.find({ _id: { $in: artist.categories } });
    await Promise.all(categorias.map((cat) => cat.removeArtist(artist._id)));
    await Artist.deleteOne({ _id: artist._id });
    return res.status(200).json({ message: "Artista eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el Artista", error: error.message });
  }
};

module.exports = {
  getAllArtists,
  getOneArtist,
  createArtist,
  deleteArtist,
};
