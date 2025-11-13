const User = require("../models/user.model");
const Concert = require("../models/concert.model");
const asyncHandler = require("express-async-handler");

// const getProfile = asyncHandler(async (req, res) => {
//   const { username } = req.params;
//   const loggedin = req.loggedin;
//   const user = await User.findOne({ username }).exec();
//   if (!user) {
//     return res.status(404).json({ message: "User Not Found" });
//   }
//   if (!loggedin) {
//     return res.status(200).json({ profile: await user.toProfileJSON(false) });
//   }
//   const loginUser = await User.findOne({ email: req.userEmail }).exec();
//   loginUser.following = loginUser.following.filter((id) => id);
//   await loginUser.save();
//   const isFollowing = loginUser.following.some((id) => id.toString() === user._id.toString());
//   return res.status(200).json({
//     profile: await user.(isFollowing),
//   });
// });

const getProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const loggedin = req.loggedin;
  const user = await User.findOne({ username }).exec();
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const usersFollowers = await User.find({ _id: { $in: user.followers } }, "username image").exec();
  const countFollowers = usersFollowers.length;
  const usersFollowing = await User.find({ _id: { $in: user.following } }, "username image").exec();
  const countFollowing = usersFollowing.length;
  const favorited = await Concert.find(
    { _id: { $in: user.favoriteConcert } },
    "slug name price date images -_id"
  ).exec();
  const favoritesCount = favorited.length;
  if (!loggedin) {
    const enrichedFavorited = favorited.map((favorito) => ({
      ...favorito.toObject(),
      favorited: false,
    }));
    return res.status(200).json({
      profile: await user.toProfilePageJSON(
        false,
        usersFollowers,
        countFollowers,
        usersFollowing,
        countFollowing,
        enrichedFavorited,
        favoritesCount
      ),
    });
  }
  const loginUser = await User.findOne({ email: req.userEmail }).exec();
  loginUser.following = loginUser.following.filter((id) => id);
  await loginUser.save();
  const isFollowing = loginUser.following.some((id) => id.toString() === user._id.toString());
  const enrichedFollowers = usersFollowers.map((follower) => ({
    ...follower.toObject(),
    following: loginUser.following.some((id) => id.toString() === follower._id.toString()),
  }));
  const enrichedFollowing = usersFollowing.map((following) => ({
    ...following.toObject(),
    following: loginUser.following.some((id) => id.toString() === following._id.toString()),
  }));
  const enrichedFavorited = (favorited || []).map((favorito) => ({
    ...favorito.toObject(),
    favorited: (loginUser.favoriteConcert || []).some(
      (id) => id?.toString() === favorito?._id?.toString()
    ),
  }));
  return res.status(200).json({
    profile: await user.toProfilePageJSON(
      isFollowing,
      enrichedFollowers,
      countFollowers,
      enrichedFollowing,
      countFollowing,
      enrichedFavorited,
      favoritesCount
    ),
  });
});

module.exports = {
  getProfile,
};
