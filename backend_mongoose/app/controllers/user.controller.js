const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const { generateAccessToken, generateRefreshToken } = require("../middleware/authService");
const RefreshToken = require("../models/refreshToken.model");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { user } = req.body;
    if (!user || !user.email || !user.username || !user.password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const emailUsed = await User.findOne({ email: user.email });
    if (emailUsed) {
      return res.status(409).json({ message: "Ese correo ya está en uso" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return res.status(400).json({ message: "El formato del email no es correcto" });
    }
    const usernameUsed = await User.findOne({ username: user.username });
    if (usernameUsed) {
      return res.status(409).json({ message: "Ese nombre de usuario ya está en uso" });
    }
    if (user.password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(user.password)) {
      return res.status(400).json({
        message: "La contraseña debe tener al menos una mayuscula, una minuscula y un numero",
      });
    }
    const hashedPwd = await argon2.hash(user.password);
    const newUser = {
      username: user.username,
      password: hashedPwd,
      email: user.email,
    };
    const createdUser = await User.create(newUser);
    if (createdUser) {
      res.status(201).json({
        user: await createdUser.toUserResponse(),
      });
    } else {
      res.status(422).json({
        errors: { body: "No se ha podido crear el usuario" },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el Usuario", error: error.message });
  }
});

const userLogin = asyncHandler(async (req, res) => {
  try {
    const { user } = req.body;
    if (!user || !user.email || !user.password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    const loginUser = await User.findOne({ email: user.email }).exec();
    if (!loginUser) return res.status(404).json({ message: "Usuario no encontrado" });
    const match = await argon2.verify(loginUser.password, user.password);
    if (!match) return res.status(401).json({ message: "Unauthorized" });
    const accessToken = generateAccessToken(loginUser);
    const refreshToken = await RefreshToken.findOne({ userId: loginUser._id }).exec();
    if (!refreshToken) {
      const refreshToken = generateRefreshToken(loginUser);
      await new RefreshToken({
        token: refreshToken,
        userId: loginUser._id,
        expiryDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
      }).save();
    }
    res.status(200).json({
      user: await loginUser.toUserResponse(accessToken),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al iniciar sesion", error: error.message });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const email = req.userEmail;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const accessToken = req.newAccessToken;
    const refreshToken = await RefreshToken.findOne({ userId: user._id }).exec();
    res.status(200).json({
      user: await user.toUserResponse(accessToken, refreshToken.token),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al conseguir los datos del usuario", error: error.message });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: "Es necesario enviar el usuario" });
    }
    const email = req.userEmail;
    const target = await User.findOne({ email }).exec();
    if (user.email) {
      target.email = user.email;
    }
    if (user.username) {
      target.username = user.username;
    }
    if (user.password) {
      const hashedPwd = await argon2.hash(user.password);
      target.password = hashedPwd;
    }
    if (typeof user.image !== "undefined") {
      target.image = user.image;
    }
    if (typeof user.bio !== "undefined") {
      target.bio = user.bio;
    }
    await target.save();
    return res.status(200).json({
      user: await target.toUserResponse(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al modificar el usuario", error: error.message });
  }
});

module.exports = {
  registerUser,
  userLogin,
  getCurrentUser,
  updateUser,
};
