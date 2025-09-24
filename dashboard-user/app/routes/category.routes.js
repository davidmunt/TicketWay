module.exports = (app) => {
  const categories = require("../controllers/category.controller.js");

  // Create a new Category
  app.post("/categories", categories.createCategory);

  // GET all Categories
  app.get("/categories", categories.getAllCategories);

  // GET one Category
  app.get("/categories/:slug", categories.getOneCategory);

  //Delete one Category
  app.delete("/categories/:slug", categories.deleteCategory);
};
