module.exports = (app) => {
  const profileController = require("../controllers/profile.controller");
  const verifyJWTOptional = require("../middleware/verifyJWTOptional");

  // Get profile
  app.get("/profile/:username", verifyJWTOptional, profileController.getProfile);
};
