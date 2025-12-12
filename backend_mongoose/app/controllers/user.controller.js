const asyncHandler = require("express-async-handler");
const argon2 = require("argon2");
const { generateAccessToken, generateRefreshToken } = require("../middleware/authService");
const RefreshToken = require("../models/refreshToken.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const cookieParser = require("cookie-parser");

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
      const cart = await Cart.create({ owner: createdUser._id });
      createdUser.cartSlug = cart.slug;
      await createdUser.save();
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
    let refreshTokenDoc = await RefreshToken.findOne({ userId: loginUser._id }).exec();
    let refreshToken;
    if (!refreshTokenDoc) {
      refreshToken = generateRefreshToken(loginUser);
      refreshTokenDoc = new RefreshToken({
        token: refreshToken,
        userId: loginUser._id,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await refreshTokenDoc.save();
    } else {
      refreshToken = refreshTokenDoc.token;
    }
    res.cookie("jid", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    let cart = await Cart.findOne({ owner: loginUser._id }).exec();
    if (!cart || loginUser.cartSlug === null) {
      cart = await Cart.create({
        owner: loginUser._id,
      });
    }
    loginUser.cartSlug = cart.slug;
    await loginUser.save();
    res.status(200).json({ user: await loginUser.toUserResponse(accessToken) });
  } catch (error) {
    return res.status(500).json({
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
      const storedToken = await RefreshToken.findOne({ token }).exec();
      if (!storedToken) {
        return res.status(401).json({ message: "Refresh token revoked or not found" });
      }
      const user = await User.findById(payload.user.id).exec();
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      await RefreshToken.deleteOne({ token });
      const newRefreshToken = generateRefreshToken(user);
      await new RefreshToken({
        token: newRefreshToken,
        userId: user._id,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }).save();
      const newAccessToken = generateAccessToken(user);
      res.cookie("jid", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al refrescar authToken", error: error.message });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.jid;
    if (token) {
      await RefreshToken.deleteOne({ token });
    }
    res.clearCookie("jid", { path: "/" });
    res.json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Error al refrescar authToken", error: error.message });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const email = req.userEmail;
    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio" });
    }
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

const getUserProfile = asyncHandler(async (req, res) => {
  const email = req.userEmail;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  const profileUser = await user.toProfileUser();
  res.status(200).json({
    user: profileUser,
  });
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

const followUser = async (req, res) => {
  try {
    const { username } = req.params;
    const userId = req.userId;
    //usuario que quiere seguir al otro usuario
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found", result: false });
    }
    if (!Array.isArray(user.following)) {
      user.following = [];
    }
    //user que vamos a seguir
    const userToFollow = await User.findOne({ username }).exec();
    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found", result: false });
    }
    const userFollowId = userToFollow._id;
    const userFollowingId = user._id;
    const isFollowing = user.following.some((id) => id && id.equals && id.equals(userFollowId));
    if (isFollowing) {
      user.following = user.following.filter((id) => id && id.equals && !id.equals(userFollowId));
      await user.save();
      userToFollow.followers = userToFollow.followers.filter((id) => id && id.equals && !id.equals(userFollowingId));
      await userToFollow.save();
      return res.status(200).json({ message: "Unfollowed user successfully", result: true });
    } else {
      user.following.push(userFollowId);
      await user.save();
      userToFollow.followers.push(userFollowingId);
      await userToFollow.save();
      return res.status(200).json({ message: "Followed user successfully", result: true });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error while following user",
      error: error.message,
      result: false,
    });
  }
};

module.exports = {
  registerUser,
  userLogin,
  getCurrentUser,
  getUserProfile,
  updateUser,
  followUser,
  refreshToken,
  logout,
};
