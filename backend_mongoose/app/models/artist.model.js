const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const ArtistSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: [],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Artist",
  }
);

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
    artist_id: this._id,
    name: this.name,
    nationality: this.nationality,
    description: this.description,
    images: this.images,
    categories: this.categories,
  };
};

module.exports = mongoose.model("Artist", ArtistSchema, "Artist");
