const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    roundNumber: {
        type: Number,
        required: true
    },
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    isCompleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Round", roundSchema);
