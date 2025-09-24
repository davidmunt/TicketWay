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
  category: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  images: [String],
});

ConcertSchema.plugin(uniqueValidator, { msg: "already taken" });

// Generar slug antes de validar
ConcertSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 10)) | 0).toString(36);
  }
  next();
});

// Metodo para respuesta limpia al frontend
ConcertSchema.methods.toConcertResponse = async function () {
  return {
    slug: this.slug,
    name: this.name,
    date: this.date,
    venue: this.venue,
    description: this.description,
    category: this.category,
    img: this.img,
  };
};

// Metodo para carrusel
ConcertSchema.methods.toConcertCarouselResponse = async function () {
  return {
    images: this.images,
  };
};

module.exports = mongoose.model("Concert", ConcertSchema);
