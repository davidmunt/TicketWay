const Venue = require("../models/venue.model.js");

const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    return res.status(200).json(
      await Promise.all(
        venues.map(async (cat) => {
          return await cat.toVenueResponse();
        })
      )
    );
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la Ubicacion", error: error.message });
  }
};

const getOneVenue = async (req, res) => {
  try {
    const { slug } = req.params;
    const venue = await Venue.findOne({ slug }).exec();
    if (!venue) {
      return res.status(404).json({ message: "Ubicacion no encontrada" });
    }
    return res.status(200).json(await venue.toVenueResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la Ubicacion", error: error.message });
  }
};

const createVenue = async (req, res) => {
  try {
    const { name, country, city, direction, description, images, capacity } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre del Venue es obligatorio" });
    }
    const newVenue = new Venue({
      name,
      country,
      city,
      direction,
      description,
      images,
      capacity,
    });
    await newVenue.save();
    return res.status(201).json({
      venue: await newVenue.toVenueResponse(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el Venue", error: error.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const { slug } = req.params;
    const venue = await Venue.findOneAndDelete({ slug });
    if (!venue) {
      return res.status(404).json({ message: "Ubicación no encontrada" });
    }
    return res.status(200).json({ message: "Ubicación eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la Ubicación", error: error.message });
  }
};

module.exports = {
  getAllVenues,
  getOneVenue,
  createVenue,
  deleteVenue,
};
