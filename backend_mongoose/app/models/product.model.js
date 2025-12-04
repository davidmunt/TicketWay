const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
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
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stockTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    stockAvailable: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "INACTIVE"],
      default: "PENDING",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "Product",
  }
);

ProductSchema.methods.toProductResponse = function () {
  return {
    product_id: this._id,
    slug: this.slug,
    name: this.name,
    description: this.description,
    productCategory: this.productCategory,
    price: this.price,
    stockTotal: this.stockTotal,
    stockAvailable: this.stockAvailable,
    imageUrl: this.imageUrl,
    status: this.status,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Product", ProductSchema, "Product");
