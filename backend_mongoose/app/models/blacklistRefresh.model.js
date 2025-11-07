const mongoose = require("mongoose");

const refreshBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    blacklistedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "RefreshBlacklist",
    timestamps: false,
  }
);

module.exports = mongoose.model("RefreshBlacklist", refreshBlacklistSchema, "RefreshBlacklist");
