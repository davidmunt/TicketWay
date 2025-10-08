const { generateAccessToken } = require("../middleware/authService");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const asyncHandler = require("express-async-handler");

const refreshToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  //cambiar de Token a Bearer
  const token = authHeader && authHeader.startsWith("Token ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  const refreshTokenRecord = await RefreshToken.findOne({ token }).exec();
  if (!refreshTokenRecord) {
    return res.status(403).json({ message: "Refresh Token not found!" });
  }
  if (refreshTokenRecord.expiryDate < new Date()) {
    await RefreshToken.findByIdAndDelete(refreshTokenRecord._id);
    return res.status(403).json({ message: "Refresh Token expired!" });
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }
    const user = await User;
    const newAccessToken = generateAccessToken({ _id: user._id });
    res.status(200).json({ accessToken: newAccessToken });
  });
});

module.exports = {
  refreshToken,
};
