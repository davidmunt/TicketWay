const Concert = require("../models/concert.model.js");
const Category = require("../models/category.model.js");

const createConcert = async (req, res) => {
  try {
    const concertData = {
      name: req.body.name || null,
      price: req.body.price || 0,
      venue: req.body.venue || null,
      description: req.body.description || null,
      date: req.body.date || null,
      img: req.body.img || null,
      images: req.body.images || [],
      id_cat: req.body.id_cat || null,
    };

    const id_cat = req.body.id_cat;
    const category = await Category.findOne({ _id: id_cat }).exec();
    if (!category) {
      res.status(400).json({ message: "Ha ocurrido un error al buscar la categoria" });
    }

    const newConcert = new Concert(concertData);
    await newConcert.save();
    if (!newConcert) {
      return res.status(400).json({ message: "Error al crear el concierto" });
    }
    await category.addConcert(newConcert._id);
    return res.status(201).json({ concert: await newConcert.toConcertResponse() });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el concierto", error: error.message });
  }
};

const getAllConcerts = async (req, res) => {
  try {
    const concerts = await Concert.find();
    return res.status(200).json(await Promise.all(concerts.map((concert) => concert.toConcertResponse())));
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
    return res.status(200).json(await concert.toConcertResponse());
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
    const id_cat = concert.id_cat;
    const category = await Category.findOne({ _id: id_cat }).exec();
    if (!category) {
      return res.status(404).json({ message: "Categoria del concierto no encontrada" });
    }
    await Concert.deleteOne({ _id: concert._id });
    await category.removeConcert(concert._id);
    return res.status(200).json({ message: "Concierto eliminado" });
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
