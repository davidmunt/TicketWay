module.exports = (app) => {
  const userController = require("../controllers/user.controller");
  const { refreshToken } = require("../controllers/auth.controller");

  // Login User
  app.post("/user/login", userController.userLogin);

  // Register new User
  app.post("/user", userController.registerUser);

  // Refresh Token
  app.post("/refresh-token", refreshToken);
};
