const mongoose = require("mongoose");

const MembershipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { versionKey: false }
);

const MembershipModel = mongoose.model("Membership", MembershipSchema);
module.exports = MembershipModel;
