const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    img: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sellPrice: {
      type: Number,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    multipleImages: [String],
  },
  { versionKey: false }
);

productSchema.index({ title: 1 });
module.exports = mongoose.model("Product", productSchema);
