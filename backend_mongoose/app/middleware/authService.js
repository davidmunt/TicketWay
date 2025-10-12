const jwt = require("jsonwebtoken");

// Generate Access Token (expires in 30 mins)
const generateAccessToken = (user) => {
  return jwt.sign({ user: { id: user._id, email: user.email } }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
};

// Generate Refresh Token (expires in 2 hours)
const generateRefreshToken = (user) => {
  return jwt.sign({ user: { id: user._id, email: user.email } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "10h" });
};

module.exports = { generateAccessToken, generateRefreshToken };
