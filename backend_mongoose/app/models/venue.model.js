const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const VenueSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    direction: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    capacity: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "Venue",
  }
);

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
    city: this.city,
    direction: this.direction,
    description: this.description,
    images: this.images,
    capacity: this.capacity,
  };
};

module.exports = mongoose.model("Venue", VenueSchema, "Venue");
