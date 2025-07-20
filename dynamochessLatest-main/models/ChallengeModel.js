const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: String,
      required: true,
    },
    toUserId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    challengerPlayerName:{
      type: String,
      required: true,
    },
    expireTime:{
      type: Date,
      required: true,
      default: () => Date.now() + 1000 * 5, // 10 minutes
    },
    expired: {
      type: Boolean,
      default: false,
    },
    challengeId:{
      type: String,
      required: true,
      unique: true,
    }

  },
  { versionKey: false }
);

const ChallengeModel = mongoose.model("Challenge", ChallengeSchema);
module.exports = ChallengeModel;
