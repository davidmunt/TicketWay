module.exports = (app) => {
  const roleController = require("../controllers/role.controller");

  // Get user role
  app.post("/role", roleController.getUserRole);
};
