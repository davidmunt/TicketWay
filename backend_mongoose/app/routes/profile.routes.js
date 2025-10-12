module.exports = (app) => {
  const profileController = require("../controllers/profile.controller");
  const verifyJWT = require("../middleware/verifyJWT");
  const verifyJWTOptional = require("../middleware/verifyJWTOptional");

  // Get profile - authentication optional
  app.get("/profile/:username", verifyJWTOptional, profileController.getProfile);
};
