const Round = require("../models/roundModel");
const Match = require("../models/matchModel");
const Player = require("../models/playerModel");
const Tournament = require("../models/tournamentModel");

// Function to pair players and create matches
const pairPlayersAndCreateMatches = async (tournamentId, roundNumber) => {
    const players = await Player.find({ tournamentId }).sort({ rating: -1 });

    const matches = [];
    for (let i = 0; i < players.length; i += 2) {
        if (i + 1 < players.length) {
            const player1 = players[i];
            const player2 = players[i + 1];

            const match = new Match({
                roundNumber,
                player1: player1._id,
                player2: player2._id,
                result: null,
                tournamentId
            });

            await match.save();
            matches.push(match._id);
        }
    }

    return matches;
};
// Create Round
const createRound = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const tournament = await Tournament.findById(tournamentId);

        if (!tournament) {
            return res.status(404).send({ success: false, message: "Tournament not found." });
        }

        const roundNumber = tournament.noOfRounds || 1;
        const matches = await pairPlayersAndCreateMatches(tournamentId, roundNumber);

        const round = new Round({
            tournamentId,
            roundNumber,
            matches,
            isCompleted: false
        });

        await round.save();
        res.status(200).send({ success: true, data: round });

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};
// Update Round
const updateRound = async (req, res) => {
    try {
        const roundId = req.params.id;
        const { isCompleted } = req.body;

        const updatedRound = await Round.findByIdAndUpdate(roundId, { isCompleted }, { new: true });
        if (!updatedRound) {
            return res.status(404).send({ success: false, message: "Round not found." });
        }

        res.status(200).send({ success: true, data: updatedRound });

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};
// Get Round Details
const getRound = async (req, res) => {
    try {
        const roundId = req.params.id;
        const round = await Round.findById(roundId).populate('matches');

        if (!round) {
            return res.status(404).send({ success: false, message: "Round not found." });
        }

        res.status(200).send({ success: true, data: round });

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};
module.exports = {
    createRound,
    updateRound,
    getRound
};
