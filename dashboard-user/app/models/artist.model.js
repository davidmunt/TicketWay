const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const ArtistSchema = mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

ArtistSchema.plugin(uniqueValidator, { msg: "already taken" });

ArtistSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 10)) | 0).toString(36);
  }
  next();
});

ArtistSchema.methods.toArtistResponse = async function () {
  return {
    slug: this.slug,
    name: this.name,
    id: this._id,
    nationality: this.nationality,
    description: this.description,
    images: this.images,
    categories: this.categories,
  };
};

module.exports = mongoose.model("Artist", ArtistSchema);
