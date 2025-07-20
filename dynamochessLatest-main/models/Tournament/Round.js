const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    roundNumber: Number,
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
});

module.exports = mongoose.model('Round', roundSchema);