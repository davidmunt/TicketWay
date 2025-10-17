const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const { refreshToken } = require("../controllers/auth.controller");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },
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
    following: [
      {
        type: String,
        default: "",
      },
    ],
    favoriteConcert: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
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

module.exports = mongoose.model("User", userSchema);
