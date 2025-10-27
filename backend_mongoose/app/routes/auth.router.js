module.exports = (app) => {
  const userController = require("../controllers/user.controller");

  // Login User
  app.post("/user/login", userController.userLogin);

  // Register new User
  app.post("/user", userController.registerUser);

  // Refresh Token
  app.post("/auth/refresh", userController.refreshToken);

  // Logout
  app.post("/auth/logout", userController.logout);
};
