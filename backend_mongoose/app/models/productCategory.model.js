const mongoose = require("mongoose");

const ProductCategorySchema = mongoose.Schema(
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
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    collection: "ProductCategory",
  }
);

ProductCategorySchema.methods.toProductCategoryResponse = function () {
  return {
    category_id: this._id,
    slug: this.slug,
    name: this.name,
    description: this.description,
    image: this.image,
    isActive: this.isActive,
    products: this.products,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("ProductCategory", ProductCategorySchema, "ProductCategory");
