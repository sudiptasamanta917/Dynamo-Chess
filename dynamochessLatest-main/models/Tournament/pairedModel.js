const mongoose = require('mongoose');

const pairedMatch = new mongoose.Schema({
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: true },
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayersTournament', required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayersTournament', required: true },
  player1Name:{
    type:String,
  },
  player2Name:{
    type:String,
  },
  matchUrl: { type: String, required: true },
  result: { type: String, enum: ['player1_win', 'player2_win', 'draw', 'pending'], default: 'pending' },
  roundNumber:{type:String}
}, { timestamps: true });

module.exports = mongoose.model('pairedMatch', pairedMatch);