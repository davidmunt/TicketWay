module.exports = (app) => {
  const categories = require("../controllers/category.controller.js");

  // GET all Categories
  app.get("/categories", categories.getAllCategories);

  // GET one Category
  app.get("/categories/:slug", categories.getOneCategory);
};
