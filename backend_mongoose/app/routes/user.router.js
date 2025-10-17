module.exports = (app) => {
  const userController = require("../controllers/user.controller.js");
  const verifyJWT = require("../middleware/verifyJWT");

  // GET User info
  app.get("/user/", verifyJWT, userController.getCurrentUser);

  // Profile User
  app.get("/user/profile", verifyJWT, userController.getUserProfile);

  // Update User
  app.put("/user/", verifyJWT, userController.updateUser);

  // Follow User
  app.post("/user/follow/:userFollowId", verifyJWT, userController.followUser);
};
