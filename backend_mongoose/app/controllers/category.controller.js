const Category = require("../models/category.model.js");

const getAllCategories = async (req, res) => {
  try {
    const { offset, limit } = req.query;
    const categories = await Category.find().skip(offset).limit(limit);
    return res.status(200).json(
      await Promise.all(
        categories.map(async (cat) => {
          return await cat.toCategoryResponse();
        })
      )
    );
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener categorias", error: error.message });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).exec();
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    return res.status(200).json(await category.toCategoryResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la categoria", error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getOneCategory,
};
