const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

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
});

ConcertSchema.plugin(uniqueValidator, { msg: "already taken" });

ConcertSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 10)) | 0).toString(36);
  }
  next();
});

ConcertSchema.methods.toConcertResponse = async function () {
  return {
    slug: this.slug,
    concert_id: this._id,
    name: this.name,
    date: this.date,
    price: this.price,
    description: this.description,
    images: this.images,
    venue: this.venue,
    category: this.category,
    artists: this.artists,
  };
};

ConcertSchema.methods.toConcertCarouselResponse = function () {
  return {
    images: this.images,
  };
};

module.exports = mongoose.model("Concert", ConcertSchema);
