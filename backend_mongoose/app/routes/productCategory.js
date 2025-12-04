module.exports = (app) => {
  const productCategory = require("../controllers/productCategory.controller.js");

  // GET one product
  app.get("/productcategory/:productCategoryId", productCategory.getOneProductCategory);
};
