const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedin = req.loggedin;
  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }
  if (!loggedin) {
    return res.status(200).json({
      profile: user.toProfileJSON(false),
    });
  } else {
    const loginUser = await User.findOne({ email: req.userEmail }).exec();
    return res.status(200).json({
      profile: user.toProfileJSON(loginUser),
    });
  }
});

module.exports = {
  getProfile,
};
