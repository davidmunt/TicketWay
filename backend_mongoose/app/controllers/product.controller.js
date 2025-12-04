const Product = require("../models/product.model.js");

const getOneProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId }).exec();
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json(await product.toProductResponse());
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};

module.exports = {
  getOneProduct,
};
