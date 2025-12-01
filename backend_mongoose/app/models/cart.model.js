const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueValidator = require("mongoose-unique-validator");

const CartSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    concerts: [
      {
        concert: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Concert",
          required: true,
        },
        ticketsQty: {
          type: Number,
          default: 1,
          min: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productQty: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "FINISHED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    collection: "Cart",
  }
);

CartSchema.plugin(uniqueValidator, { msg: "already taken" });

CartSchema.pre("validate", async function (next) {
  if (!this.slug) {
    const User = mongoose.model("User");
    const ownerDoc = await User.findById(this.owner);
    if (ownerDoc && ownerDoc.name) {
      this.slug = slugify(ownerDoc.name) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
  }
  next();
});

CartSchema.methods.toCartResponse = function () {
  return {
    slug: this.slug,
    owner: this.owner,
    isActive: this.isActive,
    status: this.status,
    concerts: this.concerts.map((item) => ({
      id: item._id,
      concert: item.concert,
      ticketsQty: item.ticketsQty,
      product: item.product,
      productQty: item.productQty,
    })),
  };
};

module.exports = mongoose.model("Cart", CartSchema, "Cart");
