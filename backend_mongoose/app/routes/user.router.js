module.exports = (app) => {
  const userController = require("../controllers/user.controller.js");
  const verifyJWT = require("../middleware/verifyJWT");

  // GET User info
  app.get("/user/", verifyJWT, userController.getCurrentUser);

  // Update User
  app.put("/user/", verifyJWT, userController.updateUser);
};
