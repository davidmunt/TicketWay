const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { v4: uuidv4 } = require("uuid");

const userAdminSchema = new mongoose.Schema(
  {
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
    image: {
      type: String,
      default: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "UserAdmin",
  }
);

userAdminSchema.plugin(uniqueValidator);

module.exports = mongoose.model("UserAdmin", userAdminSchema, "UserAdmin");
