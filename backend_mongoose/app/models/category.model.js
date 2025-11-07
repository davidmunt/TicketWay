const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const CategorySchema = mongoose.Schema(
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    concerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concert",
        default: [],
      },
    ],
    artists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concert",
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
    collection: "Category",
  }
);

CategorySchema.plugin(uniqueValidator, { msg: "already taken" });

CategorySchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
  next();
});

CategorySchema.methods.toCategoryResponse = function () {
  return {
    slug: this.slug,
    category_id: this._id,
    name: this.name,
    description: this.description,
    image: this.image,
    // concerts: this.concerts,
    artists: this.artists,
  };
};

CategorySchema.methods.toCategoryCarouselResponse = function () {
  return {
    slug: this.slug,
    name: this.name,
    description: this.description,
    image: this.image,
    category_id: this._id,
  };
};

//Conciertos
CategorySchema.methods.addConcert = function (concert_id) {
  if (this.concerts.indexOf(concert_id) === -1) {
    this.concerts.push(concert_id);
  }
  return this.save();
};

CategorySchema.methods.removeConcert = function (concert_id) {
  if (this.concerts.indexOf(concert_id) !== -1) {
    this.concerts.remove(concert_id);
  }
  return this.save();
};

module.exports = mongoose.model("Category", CategorySchema, "Category");
