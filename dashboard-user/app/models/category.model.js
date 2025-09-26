const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

CategorySchema.plugin(uniqueValidator, { msg: "already taken" });

CategorySchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  next();
});

// Formato de respuesta general
CategorySchema.methods.toCategoryResponse = function () {
  return {
    slug: this.slug,
    name: this.name,
    description: this.description,
    image: this.image,
  };
};

// Formato reducido para carrusel
CategorySchema.methods.toCategoryCarouselResponse = function () {
  return {
    slug: this.slug,
    name: this.name,
    description: this.description,
    image: this.image,
  };
};

module.exports = mongoose.model("Category", CategorySchema);
