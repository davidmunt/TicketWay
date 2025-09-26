const Category = require("../models/category.model.js");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json(categories.map((cat) => cat.toCategoryResponse()));
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
    return res.status(200).json(category.toCategoryResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la categoria", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    }
    const newCategory = new Category({
      name,
      description,
      image,
    });
    await newCategory.save();
    return res.status(201).json({
      category: newCategory.toCategoryResponse(),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la categoria",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    return res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la categoria", error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getOneCategory,
  createCategory,
  deleteCategory,
};
