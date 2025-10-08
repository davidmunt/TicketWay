const mongoose = require("mongoose");

const refreshBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date, required: true },
  blacklistedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("refreshBlacklist", refreshBlacklistSchema);
