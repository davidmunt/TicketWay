const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const { refreshToken } = require("../controllers/auth.controller");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4, unique: true },
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: { type: String, required: true },
    bio: { type: String, default: "(vacio)" },
    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
    cartSlug: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    favoriteConcert: [{ type: mongoose.Schema.Types.ObjectId, ref: "Concert", default: [] }],
  },
  {
    timestamps: true,
    collection: "User",
  }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.toUserResponse = async function (jwt_access) {
  return {
    user_id: this._id,
    username: this.username,
    email: this.email,
    bio: this.bio,
    cartSlug: this.cartSlug,
    image: this.image,
    token: jwt_access,
  };
};

userSchema.methods.toProfileUser = async function () {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
  };
};

userSchema.methods.toProfileJSON = async function (isFollowing) {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image || null,
    following: isFollowing || false,
  };
};

userSchema.methods.toProfilePageJSON = async function (
  isFollowing,
  usersFollowers,
  countFollowers,
  usersFollowing,
  countFollowing,
  favorited,
  favoritesCount
) {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image || null,
    following: isFollowing || false,
    usersFollowers: usersFollowers,
    countFollowers: countFollowers,
    usersFollowing: usersFollowing,
    countFollowing: countFollowing,
    favorited: favorited,
    favoritesCount: favoritesCount,
  };
};

userSchema.methods.toMessageResponse = async function (following = false) {
  return {
    user_id: this._id,
    username: this.username,
    image: this.image,
    following: following,
  };
};

userSchema.methods.isFavorite = function (id) {
  const idStr = id.toString();
  for (const concert of this.favoriteConcert) {
    if (concert.toString() === idStr) {
      return true;
    }
  }
  return false;
};

userSchema.methods.favorite = function (id) {
  if (this.favoriteConcert.indexOf(id) === -1) {
    this.favoriteConcert.push(id);
  }
  return this.save();
};

userSchema.methods.unfavorite = function (id) {
  if (this.favoriteConcert.indexOf(id) !== -1) {
    this.favoriteConcert.remove(id);
  }
  return this.save();
};

module.exports = mongoose.model("User", userSchema, "User");
