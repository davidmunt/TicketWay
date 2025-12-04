const ProductCategory = require("../models/productCategory.model.js");

const getOneProductCategory = async (req, res) => {
  try {
    const { productCategoryId } = req.params;
    const productCategory = await ProductCategory.findOne({ _id: productCategoryId }).exec();
    if (!productCategory) {
      return res.status(404).json({ message: "Category Product no encontrado" });
    }
    return res.status(200).json(await productCategory.toProductCategoryResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener categoria del producto", error: error.message });
  }
};

module.exports = {
  getOneProductCategory,
};
