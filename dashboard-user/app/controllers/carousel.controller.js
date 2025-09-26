const Category = require("../models/category.model.js");
const Concert = require("../models/concert.model.js");

const getCarouselCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No se encontraron categorias" });
    }
    return res.status(200).json(categories.map((category) => category.toCategoryCarouselResponse()));
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las categorias", error: error.message });
  }
};

const getCarouselConcert = async (req, res) => {
  try {
    const { slug } = req.params;
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }
    return res.status(200).json(concert.toConcertCarouselResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el concierto", error: error.message });
  }
};

module.exports = {
  getCarouselCategory,
  getCarouselConcert,
};
