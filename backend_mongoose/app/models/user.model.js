const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const { refreshToken } = require("../controllers/auth.controller");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.toUserResponse = async function (jwt_access) {
  return {
    user_id: this._id,
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image,
    token: jwt_access,
  };
};

// userSchema.methods.toProfileUser = async function () {
//   return {
//     username: this.username,
//     email: this.email,
//     bio: this.bio,
//     image: this.image,
//   };
// };

userSchema.methods.toProfileJSON = function (isFollowing) {
  return {
    username: this.username,
    email: this.email,
    bio: this.bio,
    image: this.image || null,
    following: !!isFollowing,
  };
};

module.exports = mongoose.model("User", userSchema);
