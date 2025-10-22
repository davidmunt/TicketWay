const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedin = req.loggedin;
  const user = await User.findOne({ username }).exec();
  console.log(user);
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  if (!loggedin) {
    return res.status(200).json({ profile: await user.toProfileJSON(false) });
  }
  const loginUser = await User.findOne({ email: req.userEmail }).exec();
  console.log(loginUser);
  loginUser.following = loginUser.following.filter((id) => id);
  await loginUser.save();
  const isFollowing = loginUser.following.some((id) => id.toString() === user._id.toString());
  return res.status(200).json({
    profile: await user.toProfileJSON(isFollowing),
  });
});

module.exports = {
  getProfile,
};
