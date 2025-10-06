const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const VenueSchema = mongoose.Schema({
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  capacity: {
    type: Number,
    required: true,
  },
  // concerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Concert" }],
});

VenueSchema.plugin(uniqueValidator, { msg: "already taken" });

VenueSchema.pre("validate", async function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name) + "-" + ((Math.random() * Math.pow(36, 10)) | 0).toString(36);
  }
  next();
});

VenueSchema.methods.toVenueResponse = async function () {
  return {
    slug: this.slug,
    venue_id: this._id,
    name: this.name,
    country: this.country,
    id: this._id,
    city: this.city,
    direction: this.direction,
    description: this.description,
    images: this.images,
    capacity: this.capacity,
  };
};

module.exports = mongoose.model("Venue", VenueSchema);
