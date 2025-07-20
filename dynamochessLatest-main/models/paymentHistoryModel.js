const mongoose = require("mongoose");

const paymentHistory = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    walletId: {
      type: String,
      required: true,
    },
    merchantTransactionId: {
      type: String,
      default: ""
    },
    razPaymentId:{
      type: String,
      default: ""
    },
    razOrderId:{
      type: String,
      default: ""
    },
    razSignature:{
      type: String,
      default: ""
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
   dynamoCoin: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("paymentHistory", paymentHistory);
