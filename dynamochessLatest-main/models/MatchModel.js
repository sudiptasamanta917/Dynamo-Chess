// const mongoose = require("mongoose");

// const matchSchema = new mongoose.Schema({
//     roundNumber: {
//         type: Number,
//         required: true
//     },
//     player1: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     player2: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     result: {
//         type: String,
//         enum: ["player1", "player2", "draw"],
//         default: null
//     },
//     player1Score: {
//         type: Number,
//         default: 0
//     },
//     player2Score: {
//         type: Number,
//         default: 0
//     },
//     tournamentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Tournament',
//         required: true
//     }
// });


// module.exports = mongoose.model("Match", matchSchema);
