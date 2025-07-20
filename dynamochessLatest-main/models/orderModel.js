const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: { // Reference to the User model
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billingDetails: { // Stores billing details as an object
      type: mongoose.Schema.Types.Mixed, // Allows flexibility for billing details structure
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        img: {
          type: String,
          trim: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    expectedDeliveryDate: {
      type: Date,
      default: function () {
        const date = new Date();
        date.setDate(date.getDate() + 10); // Default delivery time is 10 days from order creation
        return date;
      },
    },
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { versionKey: false }
);

// Indexes for faster querying
orderSchema.index({ user: 1 });
orderSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model("Order", orderSchema);
