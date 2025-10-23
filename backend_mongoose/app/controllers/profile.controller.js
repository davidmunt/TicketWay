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
  // const followers = await User.find({ following: { $in: [user._id] } })
  //   .select("username bio image -_id")
  //   .exec();
  // const number_followers = followers.length;
  // const follows = await User.find({ followersUsers: { $in: [user._id] } })
  //   .select("username bio image")
  //   .exec();
  // const number_follows = follows.length;
  const loginUser = await User.findOne({ email: req.userEmail }).exec();
  loginUser.following = loginUser.following.filter((id) => id);
  await loginUser.save();
  const isFollowing = loginUser.following.some((id) => id.toString() === user._id.toString());
  return res.status(200).json({
    profile: await user.toProfileJSON(isFollowing),
  });
});

// const getProfile_User = asyncHandler(async (req, res) => {
//   const { username } = req.params;
//   const user_logged = await User.findOne({ email: req.userEmail });
//   // return res.json(user_logged._id)
//   const user = await User.findOne({ username }).exec();
//   if (!user) {
//     return res.status(404).json({
//       message: "User Not Found",
//     });
//   }
//   const followers = await User.find({ followingUsers: { $in: [user._id] } })
//     .select("username bio image -_id")
//     .exec();
//   const number_followers = followers.length;
//   const follows = await User.find({ followersUsers: { $in: [user._id] } })
//     .select("username bio image")
//     .exec();
//   const number_follows = follows.length;
//   const products = await Product.find({ author: user._id }).select("-_id -author").exec();
//   return res.json({
//     profile: user.toSeeProfileUser(user_logged, followers, number_followers, follows, number_follows, products),
//   });
// });

module.exports = {
  getProfile,
};
