const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const UserCompany = require("../models/userCompany.model");
const UserAdmin = require("../models/userAdmin.model");
const argon2 = require("argon2");

const getUserRole = asyncHandler(async (req, res) => {
  try {
    const { user } = req.body;
    if (!user || !user.email || !user.password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const loginUser = await User.findOne({ email: user.email }).exec();
    if (loginUser) {
      const match = await argon2.verify(loginUser.password, user.password);
      if (!match) return res.status(401).json({ message: "Unauthorized" });
      return res.status(200).json({ role: "user" });
    }
    const loginUserCompany = await UserCompany.findOne({ email: user.email }).exec();
    if (loginUserCompany) {
      const match = await argon2.verify(loginUserCompany.password, user.password);
      if (!match) return res.status(401).json({ message: "Unauthorized" });
      return res.status(200).json({ role: "company" });
    }
    const loginUserAdmin = await UserAdmin.findOne({ email: user.email }).exec();
    if (loginUserAdmin) {
      const match = await argon2.verify(loginUserAdmin.password, user.password);
      if (!match) return res.status(401).json({ message: "Unauthorized" });
      return res.status(200).json({ role: "admin" });
    }
    return res.status(404).json({ message: "Usuario no encontrado" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar rol del usuario", error: error.message });
  }
});

module.exports = {
  getUserRole,
};
