const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    round: { type: String },
    tournamentId: { type: String },
    player1: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    user1: { type: String }, // Add user1 reference
    user2: { type: String }, // Add user2 reference
    winner: { type: String, default: "null" },
    loser: { type: String, default: "null" },
    result: { type: String, default: "pending" },
    url: { type: String, required: true }, // URL field to store the unique match URL,
    joinedCount: {
      type: Number,
      default: 0,
    },
    gameTypeWin: {
      type: String,
      default: "notDraw",
    },
    boardNumber: { type: Number }, // Board number for the match
    user1Color: {
      type: String,
      enum: ['w', 'b', null], // Color assigned to user1
      default: null,
    },
    user2Color: {
      type: String,
      enum: ['w', 'b', null], // Color assigned to user2
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now // Automatically set to the current date/time
    },
    // Timestamp for when the match was last updated
    updatedAt: {
      type: Date,
      default: Date.now // Automatically set to the current date/time
    },
    user1Joined:{
      type: Boolean,
      default: false
    },
    user2Joined:{
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("Match", matchSchema);
