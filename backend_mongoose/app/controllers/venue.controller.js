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

module.exports = {
  getAllVenues,
  getOneVenue,
};
