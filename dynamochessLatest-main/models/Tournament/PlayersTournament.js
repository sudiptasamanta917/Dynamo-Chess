// const mongoose = require('mongoose');

// // Player Schema
// const playerSchema = new mongoose.Schema({
//     score: { type: Number, default: 1 },
//     buchholz: { type: Number, default: 0 },
//     sonnebornBerger: { type: Number, default: 0 },
//     tournamentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Tournament'
//     },
//     user: {
//         type:String
//     },
//     userData: {
//         type: Object
//     },
//     gameUrls:{
// type:String
//     },
//     receivedBye: {
//         type: Boolean,
//         default: false
//     },
//     roundWiseScore:
//         [
//             {
//                 roundNumber: { type: Number },
//                 score: { type: Number }
//             }
//         ]

    
// });

// module.exports = mongoose.model('Player', playerSchema);


const mongoose = require('mongoose');

// Player Schema
const playerSchema = new mongoose.Schema({
    score: { type: Number, default: 0 },
    buchholz: { type: Number, default: 0 },
    sonnebornBerger: { type: Number, default: 0 },
    directEncounter: { type: Number, default: 0 }, // Tie-breaker: Head-to-head result
    cumulativeScore: { type: Number, default: 0 }, // Tie-breaker: Cumulative score over rounds
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament'
    },
    user: {
        type: String
    },
    userData: {
        type: Object
    },
    gameUrls: {
        type: String
    },
    receivedBye: {
        type: Boolean,
        default: false
    },
    roundWiseScore: [
        {
            roundNumber: { type: Number },
            score: { type: Number }
        }
    ],
     // History of colors played by the player (white/black)
     colorHistory: {
        type: [String], // Array to track colors played
        default: [] // Default to an empty array
    },
});

module.exports = mongoose.model('Player', playerSchema);
