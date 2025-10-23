const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ user: { id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user: { id: user._id, email: user.email } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };
