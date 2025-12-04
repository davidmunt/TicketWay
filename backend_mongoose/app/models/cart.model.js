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
          min: 0,
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
    if (ownerDoc && ownerDoc.username) {
      this.slug = slugify(ownerDoc.username) + "-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    } else {
      this.slug = "cart-" + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
  }
  next();
});

CartSchema.methods.toCartResponse = function () {
  const items = this.concerts.map((item) => {
    const concert = item.concert || {};
    const product = item.product || {};
    const concertPrice = concert.price || 0;
    const productPrice = product.price || 0;
    return {
      concert: concert._id,
      ticketsQty: item.ticketsQty,
      concertName: concert.name || null,
      concertImage: concert.images[0] || null,
      concertPricePerTicket: concertPrice,
      concertSubtotal: concertPrice * item.ticketsQty,
      product: product._id,
      productQty: item.productQty,
      productName: product.name || null,
      productImage: product.imageUrl || product.image || null,
      productPricePerUnit: productPrice,
      productSubtotal: productPrice * item.productQty,
    };
  });
  const totalPrice = items.reduce((acc, item) => acc + item.concertSubtotal + item.productSubtotal, 0);
  return {
    slug: this.slug,
    owner: this.owner,
    isActive: this.isActive,
    status: this.status,
    concerts: items,
    totalPrice: totalPrice,
  };
};

module.exports = mongoose.model("Cart", CartSchema, "Cart");
