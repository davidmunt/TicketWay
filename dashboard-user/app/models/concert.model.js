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
  venue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  images: [String],
  id_cat: {
    type: String,
    required: true,
  },
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
    name: this.name,
    date: this.date,
    venue: this.venue,
    description: this.description,
    img: this.img,
    images: this.images,
    id_cat: this.id_cat,
  };
};

ConcertSchema.methods.toConcertCarouselResponse = function () {
  return {
    images: this.images,
  };
};

module.exports = mongoose.model("Concert", ConcertSchema);
