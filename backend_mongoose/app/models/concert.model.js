const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");
const User = require("../models/user.model.js");

const ConcertSchema = mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true }],
  favoritesCount: {
    type: Number,
    default: 0,
  },
});

ConcertSchema.plugin(uniqueValidator, { msg: "already taken" });

ConcertSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 10)) | 0).toString(36);
  }
  next();
});

ConcertSchema.methods.toConcertResponse = async function (user) {
  return {
    slug: this.slug,
    concert_id: this._id,
    name: this.name,
    date: this.date,
    price: this.price,
    description: this.description,
    images: this.images,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount || 0,
    venue: this.venue,
    category: this.category,
    artists: this.artists,
  };
};

ConcertSchema.methods.updateFavoriteCount = async function () {
  const concert = this;
  const count = await User.countDocuments({ favoriteConcert: concert._id }).exec();
  concert.favoritesCount = count;
  return concert.save();
};

ConcertSchema.methods.toConcertCarouselResponse = function () {
  return {
    images: this.images,
  };
};

module.exports = mongoose.model("Concert", ConcertSchema);
