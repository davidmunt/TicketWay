const Concert = require("../models/concert.model.js");
const Category = require("../models/category.model.js");

const createConcert = async (req, res) => {
  try {
    const concertData = {
      name: req.body.name || null,
      price: req.body.price || 0,
      description: req.body.description || null,
      img: req.body.img || null,
      images: req.body.images || [],
      category: req.body.category || null,
    };
    if (concertData.category) {
      const category = await Category.findOne({ slug: concertData.category }).exec();
      if (!category) {
        return res.status(400).json({ message: "Categoría no encontrada" });
      }
    }
    const newConcert = new Concert(concertData);
    await newConcert.save();
    if (!newConcert) {
      return res.status(400).json({ message: "Error al crear el concierto" });
    }
    return res.status(201).json({
      concert: await newConcert.toConcertResponse(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el concierto", error: error.message });
  }
};

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    return res.status(200).json({
      concerts: await Promise.all(concerts.map((concert) => concert.toConcertResponse())),
      concert_count: concerts.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los conciertos", error: error.message });
  }
};

const getOneConcert = async (req, res) => {
  try {
    const { slug } = req.params;
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }
    return res.status(200).json({
      concert: await concert.toConcertResponse(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el concierto", error: error.message });
  }
};

const deleteOneConcert = async (req, res) => {
  try {
    const { slug } = req.params;
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }
    await Concert.deleteOne({ _id: concert._id });
    return res.status(200).json({
      message: "Concierto eliminado",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el concierto", error: error.message });
  }
};

module.exports = {
  createConcert,
  getAllConcerts,
  getOneConcert,
  deleteOneConcert,
};
