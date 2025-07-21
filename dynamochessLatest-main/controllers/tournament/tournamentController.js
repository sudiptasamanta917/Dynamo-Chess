// const Tournament = require("../../models/tournamentModel")
const User = require("../../models/userModel");
const mongoose = require("mongoose");
const PlayersTournament = require("../../models/Tournament/PlayersTournament");
const TournamentModel = require("../../models/Tournament/TournamentModel");
const PairedMatch = require("../../models/Tournament/pairedModel");
const { check, validationResult } = require("express-validator");
const Round = require("../../models/Tournament/Round");
const Match = require("../../models/Tournament/Match");
const moment = require("moment-timezone");
const moments = require("moment"); // Import moment for date formatting
const momentz = require("moment");
// const calculateTournamentScores = require("../../utils/scoringUtils");
// const calculateSonnebornBerger = require("../../utils/scoringUtils");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cron = require("node-cron");
// const moment = require('moment');
// tournamentController.js
// Function to calculate the number of rounds

// sleep function
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

function calculateRounds(noOfplayers) {
  return Math.floor(Math.log2(noOfplayers));
}

// Helper function to format date and time in IST
const getCurrentDateTimeInIST = () => {
  const now = moment().tz("Asia/Kolkata");
  const date = now.format("YYYY-MM-DD");
  const time = now.format("HH:mm"); // Get HH:mm in IST
  return { date, time };
};

//create unique urls
const createUniqueUrls = (noOfPlayers, gameTime, tournamentId, roundId) => {
  const protocol = "https";
  const host = "${VITE_URL}";
  const urls = [];

  // Generate n/2 unique URLs
  const numberOfUrls = Math.floor(noOfPlayers / 2);

  for (let i = 0; i < numberOfUrls; i++) {
    const inputId = uuidv4();
    const url = `${protocol}://${host}/multiplayer/tournament:${tournamentId}:${roundId}:${inputId}/${gameTime}`;
    urls.push(url);
    // console.log(url,"++++++++++++++999999999+++++++++++++++")
  }

  return urls;
};

async function calculateBuchSonberger(player, tournamentId) {
  // player.buchholz += opponent?.score || 0;
  const pairedOponentData = await PairedMatch.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { player1: new mongoose.Types.ObjectId(player.user) },
              { player2: new mongoose.Types.ObjectId(player.user) },
            ],
          },
          { tournamentId: player.tournamentId },
        ],
      },
    },
  ]);
  //  console.log(pairedOponentData,"ooooooooooooooooooo99999999999999999")

  let opponentUserIds = [];
  for (const pairedMatch of pairedOponentData) {
    if (pairedMatch.player1.toString() === player.user) {
      opponentUserIds.push(pairedMatch.player2.toString());
    }
    if (pairedMatch.player2.toString() === player.user) {
      opponentUserIds.push(pairedMatch.player1.toString());
    }
  }
  // console.log(
  //   opponentUserIds,
  //   "================================================"
  // );
  for (const opponentId of opponentUserIds) {
    // console.log(opponentId, "888888888888888888888888888888888888888888888888");
    const opponent = await PlayersTournament.findOne({ user: opponentId });
    //  console.log(opponent,"7777777777777777777777777777777777777777777")
    player.buchholz += opponent?.score || 0;
  }

  const user = await User.findOne({ _id: player.user });

  if (user) {
    player.userData.rating = user.rating; // Overwrite player's rating
    player.markModified("userData"); // Mark userData as modified
  }

  await player.save();
  // console.log(user,player.userData,player.userData.rating,user.rating,"rqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")

  // player.buchholz = totalBuchholzScore;
  await player.save();
}

const calculateTournamentScores = async (tournament, roundId, tournamentId) => {
  const tournamentData = await TournamentModel.findById(tournamentId);
  const roundData = await Round.findById(roundId); // Get round info for roundNumber

  let count = 0;
  // Loop through each player in the tournament
  for (const playerId of tournamentData.players) {
    const player = await PlayersTournament.findById(playerId);
    if (!player) continue;

    //  console.log(player, "+++++ Player Info +++++");

    // Fetch matches where the player participated in the given round
    const matches = await Match.find({
      $or: [{ user1: player.user }, { user2: player.user }],
      result: { $ne: "pending" },
      round: new mongoose.Types.ObjectId(roundId), // Ensure round filtering
    });

    // console.log(count++, matches, "+++++ Matches Info +++++");

    let roundScore = 0;
    let sonnebornBergerScore = 0;
    let directEncounterScore = 0; // For tracking head-to-head results
    if (matches.length > 0) {
      // console.log("/+++++++++++++++hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii++++++++++++++")
      // Process each  matches[0] to calculate scores

      //this is for bye condition   //
      if (
        matches[0].result === "completed" &&
        matches[0].winner === player.user &&
        matches[0].loser === "null" &&
        matches[0].gameTypeWin === "bye"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 1,
        }); // Add a new round score

        // console.log(
        //   "pahla bye or abort hoga if969696996969699696969696996969696996969699696969699696969696996"
        // );
        player.score += 1;
        await player.save();

        // Cumulative score tie-breaker (sum of scores up to the current round)
        let cumulativeScore = player.roundWiseScore.reduce(
          (total, round) => total + round.score,
          0
        );
        player.cumulativeScore = cumulativeScore + 1;
        if (matches[0].joinedCount != 0) {
          await calculateBuchSonberger(player, tournamentId);
        }
        await player.save();
      } else if (
        matches[0].result === "completed" &&
        matches[0].winner === player.user &&
        matches[0].loser === "null" &&
        matches[0].gameTypeWin === "Abort"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 1,
        }); // Add a new round score

        // console.log(
        //   "pahla bye or abort hoga if969696996969699696969696996969696996969699696969699696969696996"
        // );
        player.score += 1;
        await player.save();

        // Cumulative score tie-breaker (sum of scores up to the current round)
        let cumulativeScore = player.roundWiseScore.reduce(
          (total, round) => total + round.score,
          0
        );
        player.cumulativeScore = cumulativeScore + 1;
        await player.save();
      } else if (
        matches[0].result === "completed" &&
        matches[0].winner != player.user &&
        matches[0].loser === "null" &&
        matches[0].gameTypeWin === "Abort"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 0,
        }); // Add a new round score

        // console.log(
        //   "pahla bye or abort hoga if969696996969699696969696996969696996969699696969699696969696996"
        // );
        player.score += 0;
        await player.save();

        // Cumulative score tie-breaker (sum of scores up to the current round)
        let cumulativeScore = player.roundWiseScore.reduce(
          (total, round) => total + round.score,
          0
        );
        player.cumulativeScore = cumulativeScore + 0;
        await player.save();
      }

      // this is for normal win condition
      else if (
        matches[0].result === "completed" &&
        matches[0].winner === player.user &&
        matches[0].loser != "null"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 1,
        }); // Add a new round score

        // console.log(
        //   " dusra if969696996969699696969696996969696996969699696969699696969696996"
        // );
        await player.save();

        let opponentUser =
          matches[0].winner === player.user
            ? matches[0].loser
            : matches[0].winner;
        let opponent = await PlayersTournament.findOne({
          user: opponentUser,
          tournamentId,
        });

        // roundScore += 1; // Player won
        player.score += 1;
        sonnebornBergerScore += opponent?.score || 0; // Add opponent's score to Sonneborn-Berger

        if (opponent && opponent.score !== undefined) {
          directEncounterScore += 1; // Player wins head-to-head
        }

        // Cumulative score tie-breaker (sum of scores up to the current round)
        let cumulativeScore = player.roundWiseScore.reduce(
          (total, round) => total + round.score,
          0
        );

        player.sonnebornBerger += sonnebornBergerScore;
        player.directEncounter += directEncounterScore;
        player.cumulativeScore = cumulativeScore + 1;
        await calculateBuchSonberger(player, tournamentId);

        await player.save();
      }
      //this is for loss condition
      else if (
        matches[0].result == "completed" &&
        matches[0].loser === player.user &&
        matches[0].winner != "null"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 0,
        }); // Add a new round score

        // console.log(
        //   " teesra if 969696996969699696969696996969696996969699696969699696969696996"
        // );
        await player.save();

        let opponentUser =
          matches[0].winner === player.user
            ? matches[0].loser
            : matches[0].winner;
        let opponent = await PlayersTournament.findOne({
          user: opponentUser,
          tournamentId,
        });

        // roundScore += 1; // Player won
        player.score += 0;
        sonnebornBergerScore += opponent?.score || 0; // Add opponent's score to Sonneborn-Berger

        if (opponent && opponent.score !== undefined) {
          directEncounterScore -= 1; // Player loses head-to-head
        }

        // Cumulative score tie-breaker (sum of scores up to the current round)
        let cumulativeScore = player.roundWiseScore.reduce(
          (total, round) => total + round.score,
          0
        );

        player.sonnebornBerger += sonnebornBergerScore;
        player.directEncounter += directEncounterScore;
        player.cumulativeScore = cumulativeScore + 1;
        await calculateBuchSonberger(player, tournamentId);
        await player.save();
      }
      //when both player not played
      else if (
        matches[0].result === "completed" &&
        matches[0].loser === "null" &&
        matches[0].winner === "null" &&
        matches[0].gameTypeWin === "notDraw"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 0,
        }); // Add a new round score

        // console.log(
        //   " 4th koi join nahi hua 969696996969699696969696996969696996969699696969699696969696996"
        // );
        await player.save();
      } else if (
        matches[0].result === "completed" &&
        matches[0].loser === "null" &&
        matches[0].winner === "null" &&
        matches[0].gameTypeWin === "Draw"
      ) {
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 0.5,
        }); // Add a new round score
      } else {
        // console.log("++++++++++koi match nahi mila ++++++++++++++");
        player.roundWiseScore.push({
          roundNumber: roundData.roundNumber,
          score: 0,
        }); // Add a new round score

        // console.log(
        //   "969696996969699696969696996969696996969699696969699696969696996"
        // );
        await player.save();
      }
    } else {
      // console.log("++++++++++koi match nahi mila ++++++++++++++")
      player.roundWiseScore.push({
        roundNumber: roundData.roundNumber,
        score: 0,
      }); // Add a new round score

      // console.log(
      //   "969696996969699696969696996969696996969699696969699696969696996"
      // );
      await player.save();
    }
    // Update player's total score and tie-breakers

    // Update cumulative score with the latest round

    await player.save();

    // console.log(
    //   `Updated player ${player.user} - Score: ${player.score}, Buchholz: ${player.buchholz}, SB: ${player.sonnebornBerger}, Direct Encounter: ${player.directEncounter}, Cumulative Score: ${player.cumulativeScore}`
    // );
  }

  // Handle players with pending matches (or no matches)----------new part of the code --------

  // ---------------------new part of the code ----------
};

const simulateRoundResults = async (roundId, tournamentId, delayTime) => {
  console.log(
    roundId,
    "++++++++++++++++++92222222222222222222222+++++++++++++"
  );

  // Find all pending matches for the specified round
  const pendingMatches = await Match.aggregate([
    {
      $match: {
        round: roundId,
        result: "pending",
      },
    },
  ]);

  // console.log(pendingMatches, "Pending matches");

  // Iterate over each pending match and update the result
  for (let match of pendingMatches) {
    let result = "completed";
    await Match.updateOne({ _id: match._id }, { $set: { result } });

    // console.log(`Match ${match._id} updated with result: ${result}`);
  }

  // Get the current time in IST and add the delay time
  const updatedTimeIST = moment().tz("Asia/Kolkata").add(delayTime, "minutes");

  // Format the time as 'HH:mm'
  const formattedTime = updatedTimeIST.format("HH:mm");
  // console.log(
  //   formattedTime,
  //   "+++++++++++++++++++jjjjjjjjjjjjjjjjjjjjjjkkkkkkkkkkkkkkkkkkk++++++++++"
  // );

  await TournamentModel.updateOne(
    { _id: tournamentId },
    { $set: { time: formattedTime } }
  );

  while (true) {
    try {
      const tournament = await TournamentModel.findById(tournamentId);
      if (!tournament) {
        console.error(`Tournament with ID ${tournamentId} not found.`);
        break; // Exit the loop if the tournament doesn't exist
      }

      const { time: currentTime } = getCurrentDateTimeInIST();

      if (currentTime === tournament.time) {
        console.log("2400000000000000000000000000000000000000000000000");

        if (tournament.status === "ongoing") {
          console.log("Starting tournament...");

          const roundNumber = tournament.upComingRound;
          startTournament(
            tournamentId,
            tournament.gameTimeDuration,
            roundNumber,
            tournament.noOfRounds,
            tournament.delayTime
          );

          console.log(
            "++++++++++++++++++++++++++++++++++++ Tournament started +++++++++++++++++++++++++++++++++++++++"
          );
        }
        break; // Exit loop after starting tournament
      }
      if (tournament.status === "completed") {
        console.log("Tournament completed");
        break; // Exit loop after starting tournament
      }

      await sleep(1000); // Wait 1 second before checking again
    } catch (error) {
      console.error("Error monitoring tournament start:", error);
      break; // Exit loop on error
    }
  }
};

const assignColors = (player1, player2, boardNumber) => {
  const player1History = player1.colorHistory || [];
  const player2History = player2.colorHistory || [];
  const player1LastColor = player1History[player1History.length - 1] || null;
  const player2LastColor = player2History[player2History.length - 1] || null;
  const colorDifference = (history) =>
    history.filter((c) => c === "w").length -
    history.filter((c) => c === "b").length;
  const player1Diff = colorDifference(player1History);
  const player2Diff = colorDifference(player2History);
  // Function to determine absolute, strong, or mild preference
  const determinePreference = (diff, history) => {
    if (
      diff > 1 ||
      diff < -1 ||
      (history.length >= 2 &&
        history.slice(-2).every((c) => c === history[history.length - 1]))
    ) {
      return "absolute"; // Absolute preference if too many games with one color or last two games are same
    }
    if (diff === 1) return "strong-black";
    if (diff === -1) return "strong-white";
    if (diff === 0) return "mild";
    return null;
  };
  const player1Preference = determinePreference(player1Diff, player1History);
  const player2Preference = determinePreference(player2Diff, player2History);
  // If both have an absolute preference, give priority to the one with the bigger imbalance
  if (player1Preference === "absolute" && player2Preference === "absolute") {
    return player1Diff > player2Diff
      ? { player1Color: "b", player2Color: "w" }
      : { player1Color: "w", player2Color: "b" };
  }
  // If one player has an absolute preference, prioritize it
  if (player1Preference === "absolute") {
    return player1Diff > 1
      ? { player1Color: "b", player2Color: "w" }
      : { player1Color: "w", player2Color: "b" };
  }
  if (player2Preference === "absolute") {
    return player2Diff > 1
      ? { player1Color: "w", player2Color: "b" }
      : { player1Color: "b", player2Color: "w" };
  }
  // If one has a strong preference, grant it
  if (
    player1Preference === "strong-black" ||
    player2Preference === "strong-white"
  ) {
    return { player1Color: "b", player2Color: "w" };
  }
  function findFirstColorDifference(history1, history2) {
    for (let i = history1.length - 1; i >= 0; i--) {
      if (history1[i] !== history2[i]) {
        return history1[i] === "w"
          ? { player1Color: "b", player2Color: "w" }
          : { player1Color: "w", player2Color: "b" };
      }
    }
    return null; // No difference found
  }

  if (
    player1Preference === "strong-black" &&
    player2Preference === "strong-black"
  ) {
    if (player1LastColor === player2LastColor) {
      const colorDiff = findFirstColorDifference(
        player1History,
        player2History
      );
      return colorDiff || { player1Color: "b", player2Color: "w" }; // Default to Player 1 priority
    }
    return { player1Color: "b", player2Color: "w" };
  }

  if (
    player1Preference === "strong-white" &&
    player2Preference === "strong-white"
  ) {
    if (player1LastColor === player2LastColor) {
      const colorDiff = findFirstColorDifference(
        player1History,
        player2History
      );
      return colorDiff || { player1Color: "w", player2Color: "b" }; // Default to Player 1 priority
    }
    return { player1Color: "w", player2Color: "b" };
  }

  // If one has a strong preference, grant it
  if (
    player1Preference === "strong-black" ||
    player2Preference === "strong-white"
  ) {
    return { player1Color: "b", player2Color: "w" };
  }
  if (
    player1Preference === "strong-white" ||
    player2Preference === "strong-black"
  ) {
    return { player1Color: "w", player2Color: "b" };
  }
  // Mild preference: Alternate color based on last game
  if (player1Preference === "mild" && player2Preference === "mild") {
    if (player1LastColor === player2LastColor) {
      const colorDiff = findFirstColorDifference(
        player1History,
        player2History
      );
      return colorDiff || { player1Color: "b", player2Color: "w" }; // Default to Player 1 priority
    }
    return player1LastColor === "w"
      ? { player1Color: "b", player2Color: "w" }
      : { player1Color: "w", player2Color: "b" };
  }
  // If both players have no history, use board number rule as a fallback
  return boardNumber % 2 === 0
    ? { player1Color: "b", player2Color: "w" }
    : { player1Color: "w", player2Color: "b" };
};

const groupPlayersByScore = async (players) => {
  const scoreGroups = {};
  const seenUsers = new Set();

  players.forEach((player) => {
    if (seenUsers.has(player.user.toString())) return;
    seenUsers.add(player.user.toString());

    const score = player.score;
    if (!scoreGroups[score]) {
      scoreGroups[score] = [];
    }
    scoreGroups[score].push(player);
  });

  // Convert the object to an array and sort it by score in descending order
  const sortedGroups = Object.keys(scoreGroups)
    .sort((a, b) => b - a) // Sort scores in descending order
    .map((score) => scoreGroups[score]); // Map the sorted scores to the corresponding players

  return sortedGroups;
};

const pairPlayersForRound = async (
  tournament,
  round,
  urls,
  tournamentId,
  roundNumber
) => {
  const players = await PlayersTournament.aggregate([
    {
      $match: { tournamentId: new mongoose.Types.ObjectId(tournamentId) },
    },
    {
      $project: {
        user: 1,
        score: 1,
        buchholz: 1,
        sonnebornBerger: 1,
        directEncounter: 1,
        receivedBye: 1,
        colorHistory: 1,
        "userData.rating": 1, // Include userData.rating in the projection
      },
    },
  ]);
  const usedPlayers = new Set();
  let urlIndex = 0;
  // Retrieve previous matches to avoid repeat pairings
  const previousMatches = await Match.find({ tournamentId });
  const previousMatchups = new Set(
    previousMatches.flatMap((match) => [
      `${match.user1}-${match.user2}`,
      `${match.user2}-${match.user1}`,
    ])
  );
  let sortedPlayers;
  if (roundNumber === 1) {
    sortedPlayers = players
      .filter((p) => !usedPlayers.has(p.user.toString()))
      .sort((a, b) => (b.userData.rating || 0) - (a.userData.rating || 0));
  } else {
    // Handle sorting by score for subsequent rounds
    sortedPlayers = players
      .filter((player) => !usedPlayers.has(player.user.toString()))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
        if (b.sonnebornBerger !== a.sonnebornBerger)
          return b.sonnebornBerger - a.sonnebornBerger;
        return 0; // Add further tie-breaking criteria if needed
      });
  }
  if (sortedPlayers.length % 2 !== 0) {
    let byePlayerIndex = sortedPlayers.length - 1;
    // Find a player who hasn't received a bye yet
    while (byePlayerIndex >= 0 && sortedPlayers[byePlayerIndex].receivedBye) {
      byePlayerIndex--;
    }
    // If an eligible player for a bye is found, create a bye match
    if (byePlayerIndex >= 0) {
      const byePlayer = sortedPlayers.splice(byePlayerIndex, 1)[0];
      const match = await Match.create({
        round: round._id,
        tournamentId: tournamentId,
        player1: byePlayer._id,
        player2: null, // No opponent for a bye
        user1: byePlayer.user,
        user2: null,
        winner: byePlayer.user,
        gameTypeWin: "bye",
        result: "completed", // Mark the match as completed
        url: urls[urlIndex++ % urls.length], // Assign URL
        user1Color: null, // No color since it's a bye
        user2Color: null,
      });
      // Update player's score and mark them as having received a bye
      await PlayersTournament.updateOne(
        { _id: byePlayer._id },
        {
          $set: { score: byePlayer.score, receivedBye: true },
          $push: { colorHistory: null }, // Add null to colorHistory for a bye round
        }
      );
      round.matches.push(match); // Add the bye match to the round
      usedPlayers.add(byePlayer.user.toString());
    }
  }

  // 2. Group Players by Score
  let scoreGroups = await groupPlayersByScore(sortedPlayers);

  let finalListOfThePlayers = [];
  // 3. Handle Odd Group Pairing and Pair the Remaining Players Within Each Group
  const pairs = [];
  function movePlayersToNextGroup(player, i) {
    if (i + 1 < scoreGroups.length) {
      scoreGroups[i + 1].push(player);
    } else {
      console.log(`No next group exists for ${player.user}`);
      finalListOfThePlayers.push(player);
    }
  }

  for (let i = 0; i < scoreGroups.length; i++) {
    let currentGroup = scoreGroups[i];

    // Sort the current group based on score, Buchholz, Sonneborn-Berger
    currentGroup.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.buchholz !== a.buchholz) return b.buchholz - a.buchholz;
      if (b.sonnebornBerger !== a.sonnebornBerger)
        return b.sonnebornBerger - a.sonnebornBerger;
      return 0; // Add further tie-breaking criteria if needed
    });

    console.log(currentGroup, "Sorted Score Group");

    const isHomogeneous = currentGroup.every(
      (player) => player.score === currentGroup[0].score
    );

    if (isHomogeneous) {
      console.log("Homogeneous Array");
      let half = Math.floor(currentGroup.length / 2);

      for (let j = 0; j < half; j++) { 
        if (j + half >= currentGroup.length) break; // Ensure we don't access an out-of-bounds index
        const player1 = currentGroup[j];
        const player2 = currentGroup[j + half];

        if (
          usedPlayers.has(player1.user.toString()) ||
          usedPlayers.has(player2.user.toString())
        ) {
          continue;
        }

        const previousMatch =
          previousMatchups.has(`${player1.user}-${player2.user}`) ||
          previousMatchups.has(`${player2.user}-${player1.user}`);

        if (!previousMatch) {
          const matchUrl = urls[urlIndex++ % urls.length];
          const boardNumber = pairs.length + 1;
          const colorAssignment = await assignColors(
            player1,
            player2,
            boardNumber
          );

          const match = await Match.create({
            round: round._id,
            tournamentId: tournamentId,
            player1: player1._id,
            player2: player2._id,
            user1: player1.user,
            user2: player2.user,
            result: "pending",
            url: matchUrl,
            boardNumber: boardNumber,
            user1Color: colorAssignment.player1Color,
            user2Color: colorAssignment.player2Color,
          });

          pairs.push([player1, player2]);
          usedPlayers.add(player1.user.toString());
          usedPlayers.add(player2.user.toString());
          round.matches.push(match);

          // Update color history
          await PlayersTournament.updateOne(
            { _id: player1._id },
            { $push: { colorHistory: colorAssignment.player1Color } }
          );
          await PlayersTournament.updateOne(
            { _id: player2._id },
            { $push: { colorHistory: colorAssignment.player2Color } }
          );

          previousMatchups.add(`${player1.user}-${player2.user}`);
          previousMatchups.add(`${player2.user}-${player1.user}`);
        } else {
          let alternativePlayer = null;

          for (let k = j + half + 1; k < currentGroup.length; k++) {
            const candidate = currentGroup[k];
            if (
              candidate.user.toString() !== player1.user.toString() &&
              !usedPlayers.has(candidate.user.toString()) &&
              !previousMatchups.has(`${candidate.user}-${player1.user}`) &&
              !previousMatchups.has(`${player1.user}-${candidate.user}`)
            ) {
              alternativePlayer = candidate;
              break;
            }
          }

          if (alternativePlayer) {
            const matchUrl = urls[urlIndex++ % urls.length];
            const boardNumber = pairs.length + 1;
            const colorAssignment = await assignColors(
              player1,
              alternativePlayer,
              boardNumber
            );

            const match = await Match.create({
              round: round._id,
              tournamentId: tournamentId,
              player1: player1._id,
              player2: alternativePlayer._id,
              user1: player1.user,
              user2: alternativePlayer.user,
              result: "pending",
              url: matchUrl,
              boardNumber: boardNumber,
              user1Color: colorAssignment.player1Color,
              user2Color: colorAssignment.player2Color,
            });

            pairs.push([player1, alternativePlayer]);
            usedPlayers.add(player1.user.toString());
            usedPlayers.add(alternativePlayer.user.toString());
            round.matches.push(match);

            // Update color history
            await PlayersTournament.updateOne(
              { _id: player1._id },
              { $push: { colorHistory: colorAssignment.player1Color } }
            );
            await PlayersTournament.updateOne(
              { _id: alternativePlayer._id },
              { $push: { colorHistory: colorAssignment.player2Color } }
            );

            previousMatchups.add(`${player1.user}-${alternativePlayer.user}`);
            previousMatchups.add(`${alternativePlayer.user}-${player1.user}`);
          } else {
            movePlayersToNextGroup(player1, i);
            currentGroup.splice(j, 1);
            half = Math.floor(currentGroup.length / 2);
            j--;
          }
        }
        // Handle the odd player (unpaired player) after pairing
      }
      console.log(currentGroup, "gggggggggggggggggggggggggggggggggggggg");
      if (currentGroup.length % 2 !== 0 ) {
        const lastPlayer = currentGroup[currentGroup.length - 1];
       console.log("ffffffffffffffffffffffffffffffffff")
        if (!usedPlayers.has(lastPlayer.user.toString())) {
          movePlayersToNextGroup(lastPlayer, i);
          currentGroup.pop(); // Remove last player from the group
        }
      }
    } else {
      console.log("Heterogeneous Array");
      let remainingPlayers = [...currentGroup];

      while (remainingPlayers.length > 1) {
        const player1 = remainingPlayers[0];

        if (usedPlayers.has(player1.user.toString())) {
          remainingPlayers.shift();
          continue;
        }

        let alternativePlayerIndex = remainingPlayers.findIndex(
          (p, idx) =>
            idx !== 0 &&
            !usedPlayers.has(p.user.toString()) &&
            !previousMatchups.has(`${p.user}-${player1.user}`) &&
            !previousMatchups.has(`${player1.user}-${p.user}`)
        );

        if (alternativePlayerIndex !== -1) {
          const alternativePlayer = remainingPlayers[alternativePlayerIndex];

          const matchUrl = urls[urlIndex++ % urls.length];
          const boardNumber = pairs.length + 1;
          const colorAssignment = await assignColors(
            player1,
            alternativePlayer,
            boardNumber
          );

          const match = await Match.create({
            round: round._id,
            tournamentId: tournamentId,
            player1: player1._id,
            player2: alternativePlayer._id,
            user1: player1.user,
            user2: alternativePlayer.user,
            result: "pending",
            url: matchUrl,
            boardNumber: boardNumber,
            user1Color: colorAssignment.player1Color,
            user2Color: colorAssignment.player2Color,
          });

          pairs.push([player1, alternativePlayer]);
          usedPlayers.add(player1.user.toString());
          usedPlayers.add(alternativePlayer.user.toString());
          round.matches.push(match);

          // Update color history
          await PlayersTournament.updateOne(
            { _id: player1._id },
            { $push: { colorHistory: colorAssignment.player1Color } }
          );
          await PlayersTournament.updateOne(
            { _id: alternativePlayer._id },
            { $push: { colorHistory: colorAssignment.player2Color } }
          );

          previousMatchups.add(`${player1.user}-${alternativePlayer.user}`);
          previousMatchups.add(`${alternativePlayer.user}-${player1.user}`);

          remainingPlayers.splice(alternativePlayerIndex, 1);
          remainingPlayers.shift();
        } else {
          movePlayersToNextGroup(player1, i);
          remainingPlayers.shift();
        }

        if (
          remainingPlayers.length > 1 &&
          remainingPlayers.every((p) => p.score === remainingPlayers[0].score)
        ) {
          console.log(
            "Remaining players now form a homogeneous group. Switching strategy."
          );
          currentGroup = remainingPlayers;
          console.log("Homogeneous Array");
          let half = Math.floor(currentGroup.length / 2);
          for (let j = 0; j < half; j++) {
            if (j + half >= currentGroup.length) break; // Ensure we don't access an out-of-bounds index
            const player1 = currentGroup[j];
            const player2 = currentGroup[j + half];

            if (
              usedPlayers.has(player1.user.toString()) ||
              usedPlayers.has(player2.user.toString())
            ) {
              continue;
            }

            const previousMatch =
              previousMatchups.has(`${player1.user}-${player2.user}`) ||
              previousMatchups.has(`${player2.user}-${player1.user}`);

            if (!previousMatch) {
              const matchUrl = urls[urlIndex++ % urls.length];
              const boardNumber = pairs.length + 1;
              const colorAssignment = await assignColors(
                player1,
                player2,
                boardNumber
              );

              const match = await Match.create({
                round: round._id,
                tournamentId: tournamentId,
                player1: player1._id,
                player2: player2._id,
                user1: player1.user,
                user2: player2.user,
                result: "pending",
                url: matchUrl,
                boardNumber: boardNumber,
                user1Color: colorAssignment.player1Color,
                user2Color: colorAssignment.player2Color,
              });

              pairs.push([player1, player2]);
              usedPlayers.add(player1.user.toString());
              usedPlayers.add(player2.user.toString());
              round.matches.push(match);

              // Update color history
              await PlayersTournament.updateOne(
                { _id: player1._id },
                { $push: { colorHistory: colorAssignment.player1Color } }
              );
              await PlayersTournament.updateOne(
                { _id: player2._id },
                { $push: { colorHistory: colorAssignment.player2Color } }
              );

              previousMatchups.add(`${player1.user}-${player2.user}`);
              previousMatchups.add(`${player2.user}-${player1.user}`);
            } else {
              let alternativePlayer = null;

              for (let k = j + half + 1; k < currentGroup.length; k++) {
                const candidate = currentGroup[k];
                if (
                  candidate.user.toString() !== player1.user.toString() &&
                  !usedPlayers.has(candidate.user.toString()) &&
                  !previousMatchups.has(`${candidate.user}-${player1.user}`) &&
                  !previousMatchups.has(`${player1.user}-${candidate.user}`)
                ) {
                  alternativePlayer = candidate;
                  break;
                }
              }

              if (alternativePlayer) {
                const matchUrl = urls[urlIndex++ % urls.length];
                const boardNumber = pairs.length + 1;
                const colorAssignment = await assignColors(
                  player1,
                  alternativePlayer,
                  boardNumber
                );

                const match = await Match.create({
                  round: round._id,
                  tournamentId: tournamentId,
                  player1: player1._id,
                  player2: alternativePlayer._id,
                  user1: player1.user,
                  user2: alternativePlayer.user,
                  result: "pending",
                  url: matchUrl,
                  boardNumber: boardNumber,
                  user1Color: colorAssignment.player1Color,
                  user2Color: colorAssignment.player2Color,
                });

                pairs.push([player1, alternativePlayer]);
                usedPlayers.add(player1.user.toString());
                usedPlayers.add(alternativePlayer.user.toString());
                round.matches.push(match);

                // Update color history
                await PlayersTournament.updateOne(
                  { _id: player1._id },
                  { $push: { colorHistory: colorAssignment.player1Color } }
                );
                await PlayersTournament.updateOne(
                  { _id: alternativePlayer._id },
                  { $push: { colorHistory: colorAssignment.player2Color } }
                );

                previousMatchups.add(
                  `${player1.user}-${alternativePlayer.user}`
                );
                previousMatchups.add(
                  `${alternativePlayer.user}-${player1.user}`
                );
              } else {
                movePlayersToNextGroup(player1, i);
                currentGroup.splice(j, 1);
                half = Math.floor(currentGroup.length / 2);
                j--;
              }
            }
            // Handle the odd player (unpaired player) after pairing
          }
          console.log(currentGroup, "gggggggggggggggggggggggggggggggggggggg");
          if (currentGroup.length % 2 !== 0) {
            const lastPlayer = currentGroup[currentGroup.length - 1];

            if (!usedPlayers.has(lastPlayer.user.toString())) {
              movePlayersToNextGroup(lastPlayer, i);
              currentGroup.pop(); // Remove last player from the group
            }
          }
        }
      }
    }
  }

  console.log(
    "kkkkkk",
    scoreGroups,
    usedPlayers,
    pairs,
    "pppppppppppppppppppppppppppppppppp"
  );
  const unusedPlayers = [];

  // Collect all players who were not paired
  for (let i = 0; i < scoreGroups.length; i++) {
    for (const player of scoreGroups[i]) {
      if (!usedPlayers.has(player.user.toString())) {
        unusedPlayers.push(player);
      }
    }
  }

  console.log(
    "Unused Players:",
    unusedPlayers,
    "finalListOfThePlayers",
    finalListOfThePlayers
  );

  for (let element of finalListOfThePlayers) {
    unusedPlayers.push(element);
  }

  console.log(unusedPlayers, "unsedPlayersEndData");
  // Try to pair unused players
  while (unusedPlayers.length > 1) {
    const player1 = unusedPlayers.shift();

    let player2Index = unusedPlayers.findIndex(
      (p) =>
        !previousMatchups.has(`${p.user}-${player1.user}`) &&
        !previousMatchups.has(`${player1.user}-${p.user}`)
    );

    if (player2Index !== -1) {
      const player2 = unusedPlayers.splice(player2Index, 1)[0];

      const matchUrl = urls[urlIndex++ % urls.length];
      const boardNumber = pairs.length + 1;
      const colorAssignment = await assignColors(player1, player2, boardNumber);

      const match = await Match.create({
        round: round._id,
        tournamentId: tournamentId,
        player1: player1._id,
        player2: player2._id,
        user1: player1.user,
        user2: player2.user,
        result: "pending",
        url: matchUrl,
        boardNumber: boardNumber,
        user1Color: colorAssignment.player1Color,
        user2Color: colorAssignment.player2Color,
      });

      pairs.push([player1, player2]);
      usedPlayers.add(player1.user.toString());
      usedPlayers.add(player2.user.toString());
      round.matches.push(match);

      // Update color history
      await PlayersTournament.updateOne(
        { _id: player1._id },
        { $push: { colorHistory: colorAssignment.player1Color } }
      );
      await PlayersTournament.updateOne(
        { _id: player2._id },
        { $push: { colorHistory: colorAssignment.player2Color } }
      );

      previousMatchups.add(`${player1.user}-${player2.user}`);
      previousMatchups.add(`${player2.user}-${player1.user}`);
    } else {
      console.log(`No available opponent for ${player1.user}.`);
      finalListOfThePlayers.push(player1);
    }
  }

  // If there are unpaired players, create new score groups and attempt pairing again
  if (finalListOfThePlayers.length > 0) {
    console.log("Re-pairing remaining players...");

    // Group by score
    const newScoreGroups = {};
    finalListOfThePlayers.forEach((player) => {
      if (!newScoreGroups[player.score]) {
        newScoreGroups[player.score] = [];
      }
      newScoreGroups[player.score].push(player);
    });

    // Iterate through new score groups and attempt pairing again
    for (const score in newScoreGroups) {
      const players = newScoreGroups[score];
      while (players.length > 1) {
        const player1 = players.shift();
        let player2Index = players.findIndex(
          (p) =>
            !previousMatchups.has(`${p.user}-${player1.user}`) &&
            !previousMatchups.has(`${player1.user}-${p.user}`)
        );

        if (player2Index !== -1) {
          const player2 = players.splice(player2Index, 1)[0];

          const matchUrl = urls[urlIndex++ % urls.length];
          const boardNumber = pairs.length + 1;
          const colorAssignment = await assignColors(
            player1,
            player2,
            boardNumber
          );

          const match = await Match.create({
            round: round._id,
            tournamentId: tournamentId,
            player1: player1._id,
            player2: player2._id,
            user1: player1.user,
            user2: player2.user,
            result: "pending",
            url: matchUrl,
            boardNumber: boardNumber,
            user1Color: colorAssignment.player1Color,
            user2Color: colorAssignment.player2Color,
          });

          pairs.push([player1, player2]);
          usedPlayers.add(player1.user.toString());
          usedPlayers.add(player2.user.toString());
          round.matches.push(match);

          // Update color history
          await PlayersTournament.updateOne(
            { _id: player1._id },
            { $push: { colorHistory: colorAssignment.player1Color } }
          );
          await PlayersTournament.updateOne(
            { _id: player2._id },
            { $push: { colorHistory: colorAssignment.player2Color } }
          );

          previousMatchups.add(`${player1.user}-${player2.user}`);
          previousMatchups.add(`${player2.user}-${player1.user}`);
        } else {
          console.log(
            `No available opponent for ${player1.user}. They remain unpaired.`
          );
        }
      }
    }
  }

  // Log the final state
  console.log("Final Unpaired Players:", unusedPlayers,scoreGroups);
  console.log("Final Pairings:", pairs);

  // Save the round with all its matches
  await round.save();
  // console.log(`Paired ${pairs.length} players for the round.`);
  return round.matches;
};

const createTournament = async (req, res) => {
  try {
    // console.log("kakakak");
    const {
      tournamentName,
      startDate,
      entryFees,
      time,
      gameTimeDuration,
      delayTime,
    } = req.body;
    // console.log(req.body);
    const createdBy = req.user._id;

    // Parse and validate the start date
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start date.",
      });
    }

    // Validate entry fees
    const fees = parseFloat(entryFees);
    if (isNaN(fees) || fees < 0) {
      return res.status(400).json({
        success: false,
        message: "Entry fees must be a valid positive number.",
      });
    }

    // Calculate the number of rounds based on the number of players
    // const rounds = calculateRounds(noOfplayers || 10);
    // console.log(rounds, "lllllll");

    // Create a new tournament
    const tournament = new TournamentModel({
      tournamentName,
      startDate: startDate,
      entryFees: fees.toString(), // Convert to string for consistency
      time,
      topThreePlayer: [],
      JoinedPlayerList: [],
      tournamentIsJoin: false,
      createdBy,
      gameTimeDuration,
      delayTime,
    });

    // Save the tournament to the database
    const tournamentData = await tournament.save();

    // Send success response
    return res.status(200).json({
      success: true,
      data: tournamentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the tournament.",
      error: error.message,
    });
  }
};

const updateTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const {
      tournamentName,
      startDate,
      entryFees,
      time,
      gameTimeDuration,
      delayTime,
    } = req.body;

    // Log incoming request
    // console.log(
    //   tournamentName,
    //   startDate,
    //   entryFees,
    //   time,
    //   gameTimeDuration,
    //   delayTime,
    //   tournamentId
    // );

    // Check if tournamentId is valid
    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid tournament ID format.",
      });
    }

    // Parse and format the startDate to YYYY-MM-DD format
    const formattedStartDate = moments(startDate).format("YYYY-MM-DD");

    // Check if formattedStartDate is a valid date
    if (!moments(formattedStartDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).send({
        success: false,
        message: "Invalid start date.",
      });
    }

    // Check if EntryFees is a valid number
    const fees = parseFloat(entryFees);
    if (isNaN(fees) || fees < 0) {
      return res.status(400).send({
        success: false,
        message: "Entry fees must be a valid positive number.",
      });
    }

    // Check if the tournament exists
    const existingTournament = await TournamentModel.findById(tournamentId);
    if (!existingTournament) {
      return res.status(404).send({
        success: false,
        message: "Tournament not found.",
      });
    }

    // Now updating the tournament
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      {
        tournamentName,
        startDate: formattedStartDate, // Use formatted startDate
        entryFees: fees.toString(), // Storing as a string
        time, // Update time as it is (in IST)
        delayTime,
        gameTimeDuration,
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      data: updatedTournament,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};

const deleteTournament = async (req, res) => {
  const tournamentId = req.params.id;
  const deletedTournament = await TournamentModel.findByIdAndDelete(
    tournamentId
  );
  res.status(200).json({
    success: true,
    data: deletedTournament,
  });
};

const getMyTournament = async (req, res) => {
  // const userId=req.params.id
  const myTournament = await TournamentModel.aggregate([
    {
      $match: {
        tournamentIsJoin: false,
      },
    },
  ]);
  res.status(200).json({
    success: true,
    data: myTournament,
  });
};
const getAllTournament = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the starting index
    const startIndex = (page - 1) * limit;

    // Fetch the tournaments with pagination
    const tournaments = await TournamentModel.find({})
      .sort({ startDate: -1, time: -1 })
      .skip(startIndex) // Skip the previous pages' data
      .limit(limit); // Limit to 'limit' number of items

    // Fetch the total count of tournaments for metadata
    const totalTournaments = await TournamentModel.countDocuments();

    res.status(200).json({
      success: true,
      data: tournaments,
      meta: {
        total: totalTournaments, // Total number of tournaments
        page, // Current page
        totalPages: Math.ceil(totalTournaments / limit), // Total pages
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "An error occurred while retrieving tournaments.",
      error: error.message,
    });
  }
};
const searchTournament = async (req, res) => {
  const { searchTerm } = req.query;
  // console.log(searchTerm)

  try {
    const tournaments = await TournamentModel.find({
      tournamentName: { $regex: searchTerm, $options: "i" },
    });

    res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while searching tournaments.",
      error: error.message,
    });
  }
};

const getTournamentByUserId = async (req, res) => {
  const userId = req.user._id;

  try {
    const tournaments = await TournamentModel.find({
      "JoinedPlayerList.user": userId,
    }).sort({ startDate: -1, time: -1 });

    res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving tournaments.",
      error: error.message,
    });
  }
};
const joinTournament = async (req, res) => {
  const { tournamentId } = req.params;
  const userId = req.user._id;

  try {
    // Fetch the tournament by ID
    let tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found.",
      });
    }

    // Check if the user is already a participant
    const userAlreadyInTournament = tournament.JoinedPlayerList.some((player) =>
      player.user.equals(userId)
    );
    if (userAlreadyInTournament) {
      return res.status(400).json({
        success: false,
        message: "User is already a participant in this tournament.",
      });
    }

    //when the tournament time exceed then no body can join

    if (tournament.status == "ongoing") {
      res.status(400).json({
        success: false,
        message: "Tournament is already ongoing",
      });
    }
    if (tournament.status == "completed") {
      res.status(400).json({
        success: false,
        message: "Tournament is already completed",
      });
    }

    // Check if the current time exceeds the tournament start time
    // if (tournament.status === "pending") {
    //   const currentTime = momentz();
    //   const tournamentStartTime = momentz(tournament.time); // Assuming `tournament.time` is in a valid datetime format

    //   if (currentTime.isAfter(tournamentStartTime)) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Tournament time is over. You cannot join now.",
    //     });
    //   }
    // }

    const userData = await User.findById(userId);
    // console.log(userData, "uuuuuuuuuuu");
    // Add the user to the tournament's JoinedPlayerList
    tournament.JoinedPlayerList.push({ user: userId, userData: userData }); // Adjust based on actual data structure
    tournament.noOfplayers = tournament.JoinedPlayerList.length;
    await tournament.save();
    const noOfplayer = tournament.noOfplayers;
    const rounds = calculateRounds(noOfplayer);
    tournament.noOfRounds = rounds;
    await tournament.save();
    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while joining the tournament.",
      error: error.message,
    });
  }
};

const getTournamentById = async (req, res) => {
  const tournamentId = req.params.id;
  try {
    const tournament = await TournamentModel.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the tournament",
      error: error.message,
    });
  }
};

const getPairedList = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // const userId = req.user._id;
    // console.log(tournamentId, "kkkkkk");

    // Find paired matches where the user is either player1 or player2
    const pairedMatchList = await PairedMatch.find({
      tournamentId: tournamentId,
    });

    // If no paired matches are found, return an empty array
    if (!pairedMatchList || pairedMatchList.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No paired matches found",
        data: [], // Return an empty array
      });
    }

    // const boardData = await Match.find({
    //   tournamentId: tournamentId,
    // });

    // Return the list of paired matches
    return res.status(200).json({
      success: true,
      data: pairedMatchList,
    });
  } catch (error) {
    // Handle errors and return an appropriate response
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching paired matches.",
      error: error.message,
    });
  }
};

const adminNotification = async (req, res) => {
  try {
    // Get the current date and time in IST
    const istMoment = moment().tz("Asia/Kolkata");

    // Format the IST date to 'YYYY-MM-DD'
    const date = istMoment.format("YYYY-MM-DD");

    // Get the current IST time (HH:mm)
    const currentTime = istMoment.format("HH:mm");

    // Calculate the IST time 5 minutes ahead
    const futureTimeMoment = istMoment.clone().add(5, "minutes");
    const futureFormattedTime = futureTimeMoment.format("HH:mm");

    // console.log("IST Current Date:", date);
    // console.log("IST Current Time:", currentTime);
    // console.log("IST Time 5 Minutes Ahead:", futureFormattedTime);

    // Find tournaments where the start date is today and the time is within the range
    const tournaments = await TournamentModel.aggregate([
      {
        $match: {
          startDate: date,
          status: "pending",
          // time: {
          //   $gte: currentTime,
          //   $lte: futureFormattedTime,
          // },
        },
      },
    ]);

    if (tournaments && tournaments.length > 0) {
      res.status(200).json({
        success: true,
        data: tournaments,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No tournaments found within the time range",
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const startTournament = async (
  tournamentId,
  gameTime,
  roundNumber,
  noOfRounds,
  delayTime
) => {
  try {
    const tournament = await TournamentModel.findById(tournamentId).populate(
      "players"
    );
    if (!tournament)
      return res.status(404).json({ message: "Tournament not found" });

    if (roundNumber == 1) {
      console.log(
        "call1111111111111111111111111111111111111111111111111111111111111111111111"
      );
      if (tournament.status == "pending") {
        // Check if there are enough players
        if (tournament.JoinedPlayerList.length < 2) {
          //  console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj")
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        // Create or fetch Player documents
        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }

        // Update the tournament with player IDs and set status to ongoing
        tournament.players = playerIds;
        tournament.status = "ongoing";
        tournament.upComingRound = 2; // Increment after first round starts
        await tournament.save();

        const roundDuration = gameTime * 2000 + 60000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        console.log(
          round,
          roundNumber,
          tournament.upComingRound,
          "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR"
        );
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };

        const terminateRound = async (roundId) => {
          try {
            let count = 0;
            while (true) {
              const matchesData = await Match.find({ round: roundId });
              console.log("Checking match results...");
              console.log(count, (gameTime * 2) / 10);
              let completedMatches = 0;
              await Promise.all(
                matchesData.map(async (match) => {
                  if (
                    match.joinedCount === 0 ||
                    match.gameTypeWin === "Draw" ||
                    (count === (gameTime * 2) / 10 &&
                      match.joinedCount === 2 &&
                      match.result === "pending") ||
                    (match.joinedCount === 1 && match.result === "pending")
                  ) {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );
              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);
                console.log("Round finalized.");
                break;
              }
              await sleep(10000);
              count++;
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };

        // Start scheduling
        scheduleNextRound();
      }
    } else if (roundNumber == 2) {
      console.log(
        "call222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222"
      );
      if (tournament.status == "ongoing") {
        // Similar logic for rounds > 1
        if (tournament.JoinedPlayerList.length < 2) {
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }

        tournament.players = playerIds;
        tournament.upComingRound = 3; // Increment round for ongoing rounds
        await tournament.save();

        const roundDuration = gameTime * 2000 + 60000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        console.log(
          round,
          roundNumber,
          tournament.upComingRound,
          "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
        );
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };
        const terminateRound = async (roundId) => {
          try {
            let count = 0;
            while (true) {
              const matchesData = await Match.find({ round: roundId });
              console.log("Checking match results...");
              let completedMatches = 0;
              await Promise.all(
                matchesData.map(async (match) => {
                  if (
                    match.joinedCount === 0 ||
                    match.gameTypeWin === "Draw" ||
                    (count === (gameTime * 2) / 10 &&
                      match.joinedCount === 2 &&
                      match.result === "pending") ||
                    (match.joinedCount === 1 && match.result === "pending")
                  ) {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );
              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);
                console.log("Round finalized.");
                break;
              }
              await sleep(10000);
              count++;
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };
        // Start scheduling
        scheduleNextRound();
      }
    } else if (roundNumber == 3) {
      console.log(
        "cal3333333333333333333333333333333333333333333333333333333333333333333"
      );
      if (tournament.status == "ongoing") {
        // Similar logic for rounds > 1
        if (tournament.JoinedPlayerList.length < 2) {
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }

        tournament.players = playerIds;
        tournament.upComingRound = 4; // Increment round for ongoing rounds
        await tournament.save();

        const roundDuration = gameTime * 2000 + 60000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        console.log(
          round,
          roundNumber,
          tournament.upComingRound,
          "ttttttttttttttttttttttttttttttttttttttttttttttttttt"
        );
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };

        const terminateRound = async (roundId) => {
          try {
            while (true) {
              const matchesData = await Match.find({ round: roundId });

              console.log("Checking match results...");

              let completedMatches = 0;

              await Promise.all(
                matchesData.map(async (match) => {
                  if (match.joinedCount === 0 || match.gameTypeWin === "Draw") {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );

              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);

                console.log("Round finalized.");
                break;
              }

              await sleep(1000);
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };

        // Start scheduling
        scheduleNextRound();
      }
    } else if (roundNumber == 4) {
      console.log(
        "cal4444444444444444444444444444444444444444444444444444444444444444444"
      );
      if (tournament.status == "ongoing") {
        // Similar logic for rounds > 1
        if (tournament.JoinedPlayerList.length < 2) {
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }
        tournament.players = playerIds;
        tournament.upComingRound = 5; // Increment round for ongoing rounds
        await tournament.save();

        const roundDuration = gameTime * 2000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };

        const terminateRound = async (roundId) => {
          try {
            while (true) {
              const matchesData = await Match.find({ round: roundId });

              console.log("Checking match results...");

              let completedMatches = 0;

              await Promise.all(
                matchesData.map(async (match) => {
                  if (match.joinedCount === 0 || match.gameTypeWin === "Draw") {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );

              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);

                console.log("Round finalized.");
                break;
              }

              await sleep(1000);
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };

        // Start scheduling
        scheduleNextRound();
      }
    } else if (roundNumber == 5) {
      if (tournament.status == "ongoing") {
        // Similar logic for rounds > 1
        if (tournament.JoinedPlayerList.length < 2) {
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }

        tournament.players = playerIds;
        tournament.upComingRound = 6; // Increment round for ongoing rounds
        await tournament.save();

        const roundDuration = gameTime * 2000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };
        const terminateRound = async (roundId) => {
          try {
            while (true) {
              const matchesData = await Match.find({ round: roundId });

              console.log("Checking match results...");

              let completedMatches = 0;

              await Promise.all(
                matchesData.map(async (match) => {
                  if (match.joinedCount === 0 || match.gameTypeWin === "Draw") {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );

              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);

                console.log("Round finalized.");
                break;
              }

              await sleep(1000);
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };

        // Start scheduling
        scheduleNextRound();
      }
    } else if (roundNumber == 6) {
      if (tournament.status == "ongoing") {
        // Similar logic for rounds > 1
        if (tournament.JoinedPlayerList.length < 2) {
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }

        tournament.players = playerIds;
        tournament.upComingRound = 7; // Increment round for ongoing rounds
        await tournament.save();

        const roundDuration = gameTime * 2000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };

        const terminateRound = async (roundId) => {
          try {
            while (true) {
              const matchesData = await Match.find({ round: roundId });

              console.log("Checking match results...");

              let completedMatches = 0;

              await Promise.all(
                matchesData.map(async (match) => {
                  if (match.joinedCount === 0 || match.gameTypeWin === "Draw") {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );

              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);

                console.log("Round finalized.");
                break;
              }

              await sleep(1000);
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };

        // Start scheduling
        scheduleNextRound();
      }
    } else if (roundNumber == 7) {
      if (tournament.status == "ongoing") {
        // Similar logic for rounds > 1
        if (tournament.JoinedPlayerList.length < 2) {
          tournament.status = "suspended";
          await tournament.save();
          return;
        }

        const BATCH_SIZE = 100; // Define batch size
        const playerIds = [];

        // Fetch all existing players in one query
        const existingPlayers = await PlayersTournament.find({
          user: { $in: tournament.JoinedPlayerList.map((p) => p.user) },
          tournamentId: tournament._id,
        }).lean();

        const existingPlayerMap = new Map(
          existingPlayers.map((p) => [p.user.toString(), p])
        );

        const newPlayers = [];

        // Prepare new player documents
        for (const joinedPlayer of tournament.JoinedPlayerList) {
          const userId = joinedPlayer.user.toString();

          if (existingPlayerMap.has(userId)) {
            playerIds.push(existingPlayerMap.get(userId)._id);
          } else {
            newPlayers.push({
              user: joinedPlayer.user,
              userData: joinedPlayer.userData,
              tournamentId: tournament._id,
            });
          }
        }

        // Insert new players in batches
        for (let i = 0; i < newPlayers.length; i += BATCH_SIZE) {
          const batch = newPlayers.slice(i, i + BATCH_SIZE);
          const result = await PlayersTournament.insertMany(batch, {
            ordered: false,
          });

          playerIds.push(...result.map((p) => p._id));
        }

        tournament.players = playerIds;
        tournament.upComingRound = 8; // Increment round for ongoing rounds
        await tournament.save();

        const roundDuration = gameTime * 2000; // Assuming time in milliseconds
        const round = await Round.create({ roundNumber });
        const urls = createUniqueUrls(
          tournament.noOfplayers,
          gameTime,
          tournamentId,
          round._id
        );

        const scheduleNextRound = async () => {
          if (tournament.status === "completed") return;

          try {
            await pairPlayersForRound(
              tournament,
              round,
              urls,
              tournamentId,
              roundNumber
            );

            // Fetch all pending matches
            const pendingMatches = await Match.find({
              result: "pending",
              round: round._id,
            }).lean();

            // Collect unique player IDs
            const playerIds = [
              ...new Set(
                pendingMatches.flatMap((match) => [
                  match.player1,
                  match.player2,
                ])
              ),
            ];

            // Batch fetch all player data in one query
            const players = await PlayersTournament.find({
              _id: { $in: playerIds },
            }).lean();

            // Create a Map for quick lookup
            const playerMap = new Map(
              players.map((player) => [player._id.toString(), player])
            );

            // Prepare match data for bulk insert
            const pairedMatches = pendingMatches.map((match) => ({
              tournamentId: tournament._id,
              roundId: round._id,
              player1: playerMap.get(match.player1.toString()).user,
              player2: playerMap.get(match.player2.toString()).user,
              player1Name: playerMap.get(match.player1.toString()).userData
                .name,
              player2Name: playerMap.get(match.player2.toString()).userData
                .name,
              matchUrl: match.url,
              result: "pending",
              roundNumber,
            }));

            // Bulk insert all paired matches
            await PairedMatch.insertMany(pairedMatches);

            tournament.rounds.push(round);
            await tournament.save();

            console.log("Next round scheduled successfully.");
            for (let i = 0; i < 60; i++) {
              console.log(i);
              await sleep(1000);
            }

            await terminateRound(round._id);
          } catch (error) {
            console.error("Error scheduling next round:", error);
          }
        };

        const terminateRound = async (roundId) => {
          try {
            while (true) {
              const matchesData = await Match.find({ round: roundId });

              console.log("Checking match results...");

              let completedMatches = 0;

              await Promise.all(
                matchesData.map(async (match) => {
                  if (match.joinedCount === 0 || match.gameTypeWin === "Draw") {
                    match.result = "completed";
                    await match.save();
                  }
                  if (match.result === "completed") completedMatches++;
                })
              );

              if (completedMatches === matchesData.length) {
                console.log("All matches completed, finalizing round.");
                if (roundNumber === noOfRounds) {
                  tournament.status = "completed";
                  await tournament.save();
                }
                await calculateTournamentScores(
                  tournament,
                  roundId,
                  tournamentId
                );
                await simulateRoundResults(roundId, tournamentId, delayTime);

                console.log("Round finalized.");
                break;
              }

              await sleep(1000);
            }
          } catch (error) {
            console.error("Error in round termination:", error);
          }
        };

        // Start scheduling
        scheduleNextRound();
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const getUpcomingTournament = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get the current date and time
    // Get the current time in IST
    const currentTime = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istTime = new Date(currentTime.getTime() + istOffset);

    // Format the current date as YYYY-MM-DD (e.g., "2024-08-26")
    const currentDate = istTime.toISOString().slice(0, 10);

    // Format the current time as HH:MM (e.g., "15:32")
    const currentFormattedTime = istTime.toTimeString().slice(0, 5);

    // console.log(currentFormattedTime, currentDate);

    const tournamentData = await TournamentModel.aggregate([
      {
        $match: {
          "JoinedPlayerList.user": new mongoose.Types.ObjectId(userId), // Use `new` keyword here
          status: "ongoing",
          startDate: currentDate, // Match the current date (e.g., "2024-08-26")
          time: currentFormattedTime, // Match the time exactly one minute from now (e.g., "15:32")
        },
      },
      {
        $sort: { time: 1 }, // Sort by the time to get the most upcoming tournaments first
      },
    ]);
    if (!tournamentData) {
      res.status(404).json({ message: "No upcoming tournaments found" });
    }
    //console.log(tournamentData, "ppppppppp");

    const pairedMatches = await Match.find({
      $and: [
        {
          $or: [{ user1: userId }, { user2: userId }],
        },
        { result: "pending" },
      ],
    });
    // console.log(pairedMatches,"++++++ddddddddddddddddddddddddddddddddddddddddd+++++++++")

    if (!pairedMatches) {
      res.status(404).json({ message: "No paird match found" });
    }

    res.status(200).json({
      tournaments: tournamentData,
      pairedMatches: pairedMatches,
    });
  } catch (error) {
    console.error("Error fetching upcoming tournaments:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getpairPlayers = async (req, res) => {
  const tournamentId = req.params.id;
  // console.log(tournamentId);
  try {
    const tournament = await PairedMatch.findOne({
      tournamentId: tournamentId,
    });
    // console.log(tournament);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }
    const player1 = await User.findById(tournament.player1).select("-password");
    const player2 = await User.findById(tournament.player2).select("-password");
    res.status(200).json({
      success: true,
      data: {
        tournament,
        player1,
        player2,
      },
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the players",
      error: error.message,
    });
  }
};

const getOngoingmatch = async (req, res) => {
  try {
    const tournament = await TournamentModel.find({
      status: "ongoing",
    });
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }
    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the tournament",
      error: error.message,
    });
  }
};

const getOngoingmatchData = async (req, res) => {
  try {
    const round = req.params.id;
    // console.log(round,"uuuuuuuuuuuuuu");
    // Use findOne to search by a field other than the _id
    const matchesData = await Match.aggregate([
      { $match: { round: round, result: "completed" } },
    ]);
    //  console.log(matchesData,"uyyyyyyyyyyy")

    if (!matchesData) {
      return res.status(404).json({
        success: false,
        message: "Round not found",
      });
    }
    let playersScore = [];

    for (let element of matchesData) {
      let userId1 = element.user1;
      let userId2 = element.user2;
      // console.log(userId1.toString(), userId2.toString());
      let user1 = await PlayersTournament.findOne({ user: userId1.toString() }); // Convert ObjectId to string if necessary
      let user2 = await PlayersTournament.findOne({ user: userId2.toString() });
      // console.log(user1, user2);
      playersScore.push(user1, user2);
    }

    if (matchesData) {
      res.status(200).json({
        success: true,
        data: playersScore,
        matchesData: matchesData,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the round data",
      error: error.message,
    });
  }
};

const getTournamentResult = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // console.log(tournamentId,"kkkkkkk")
    // Aggregate players data, matching by tournamentId and sorting by score, buchholz, and sonnebornBerger
    const playersData = await PlayersTournament.aggregate([
      {
        $match: {
          tournamentId: new mongoose.Types.ObjectId(tournamentId),
        },
      },
      {
        // Sort first by score, then by buchholz, then by sonnebornBerger
        $sort: {
          score: -1, // Sort by score in descending order
          buchholz: -1, // Sort by buchholz in descending order
          sonnebornBerger: -1, // Sort by sonnebornBerger in descending order
          directEncounter: -1, // Sort by direct encounter in descending order
          cumulativeScore: -1, // Sort by cumulative score in descending order
          "userData.name": 1, // Sort alphabetically by 'userData.user' in ascending order (A to Z)
        },
      },
    ]);

    // Check if any data was found
    if (!playersData || playersData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No results found",
      });
    }

    // Respond with the sorted players data
    res.status(200).json({
      success: true,
      data: playersData,
    });
  } catch (error) {
    // Handle any errors that occur during the aggregation
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getOngoingMatchDatas = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    // Destructuring the rounds from the request body
    // console.log(tournamentId,"hiiiiiiiiiiii")
    const playerScoredata = await PlayersTournament.aggregate([
      {
        $match: {
          tournamentId: new mongoose.Types.ObjectId(tournamentId),
        },
      },
    ]);
    // Initialize an array to store all players' scores
    // console.log(playerScoredata)

    // Respond with the collected players' scores and matches data
    res.status(200).json({
      success: true,
      data: playerScoredata,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the match data",
      error: error.message,
    });
  }
};
const getCompletedmatch = async (req, res) => {
  try {
    const tournament = await TournamentModel.find({
      status: "completed",
    }).sort({ startDate: -1, time: -1 });
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }
    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the tournament",
      error: error.message,
    });
  }
};

const getJoinedCount = async (req, res) => {
  try {
    const { tournamentId, roundId, userId } = req.params;
    // console.log(
    //   tournamentId,
    //   roundId,
    //   userId,
    //   "1222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222"
    // );
    // Find the match for the given tournament, round, and user
    const match = await Match.findOneAndUpdate(
      {
        tournamentId: tournamentId,
        round: roundId,
        $or: [{ user1: userId }, { user2: userId }],
      },
      {
        $inc: { joinedCount: 1 }, // Increment the joinedCount by 1
      },
      { new: true } // Return the updated document after modification
    );
    if (match) {
      res.status(200).json({
        message: "User joined successfully. Join count incremented.",
        match,
      });
    } else {
      res.status(404).json({ message: "Match not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error joining match", error });
  }
};

const getboardNumberData = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const boardData = await Match.find({
      tournamentId: tournamentId,
    });

    res.status(200).json({
      success: true,
      data: boardData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching board number data" });
  }
};

const getDataByRoundIdAndNumber = async (req, res) => {
  const { tournamentId, roundNumber } = req.params;
  // console.log(tournamentId, roundNumber);
  try {
    const roundNum = parseInt(roundNumber, 10);
    const players = await PlayersTournament.aggregate([
      {
        $match: {
          tournamentId: new mongoose.Types.ObjectId(tournamentId),
          "roundWiseScore.roundNumber": roundNum,
        },
      },
      {
        $project: {
          "userData.name": 1, // Project userData name
          roundScore: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$roundWiseScore",
                  as: "score",
                  cond: { $eq: ["$$score.roundNumber", roundNum] },
                },
              },
              0, // Extract the first matching roundScore
            ],
          },
        },
      },
    ]);
    // Ensure that the response structure contains both userData and roundScore
    res.status(200).json({ success: true, data: players });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userScoreDataForAdmin = async (req, res) => {
  const { tournamentId } = req.params;
  try {
    const scoreData = await PlayersTournament.aggregate([
      {
        $match: {
          tournamentId: new mongoose.Types.ObjectId(tournamentId),
        },
      },
      {
        $project: {
          score: 1,
          buchholz: 1,
          sonnebornBerger: 1,
          directEncounter: 1,
          cumulativeScore: 1,
          "userData.rating": 1,
          "userData.name": 1,
          "roundWiseScore.roundNumber": 1,
          "roundWiseScore.score": 1,
        },
      },
      {
        $sort: {
          score: -1, // Sort by score in descending order
          buchholz: -1, // Sort by buchholz in descending order
          sonnebornBerger: -1, // Sort by sonnebornBerger in descending order
          directEncounter: -1, // Sort by direct encounter in descending order
          cumulativeScore: -1, // Sort by cumulative score in descending order
          "userData.name": 1, // Sort alphabetically by 'userData.name' in ascending order
        },
      },
    ]);

    // Restructure the response
    const formattedData = scoreData.map((player, index) => {
      return {
        [index + 1]: {
          name: player.userData.name, // Assuming `name` is part of `userData`
          rating: player.userData.rating,
          scores: player.roundWiseScore.map((rws) => rws.score),
          totalPoints: player.score,
        },
      };
    });

    // Response
    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user score data" });
  }
};

const getTime = async (req, res) => {
  // Even if the system time is wrong, this will give the correct time for the specified timezone
  const indiaTime = moment().tz("Asia/Kolkata").format();
  // console.log(indiaTime); // Correct Indian Standard Time (IST)
  if (!indiaTime) {
    res.status(400).json({
      success: false,
      message: "Failed to get the current time",
    });
  }
  res.status(200).json({
    success: true,
    time: indiaTime,
  });
};

const redirectUrl = async (req, res) => {
  try {
    const { roundId, userId } = req.params;

    // Find all matches with the given roundId
    const matchData = await Match.find({ round: roundId });
    // console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

    if (!matchData || matchData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matches found for the given roundId",
      });
    }

    // Update the user join status
    for (let element of matchData) {
      if (userId === element.user1) {
        element.user1Joined = true;
      } else if (userId === element.user2) {
        element.user2Joined = true;
      }
      await element.save(); // Save each updated match document
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: matchData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating user status",
    });
  }
};
// Cron job to start tournaments that are pending and match the current date and time
cron.schedule("*/10 * * * * *", async () => {
  // Every 10 seconds
  const { date, time } = getCurrentDateTimeInIST();
  // console.log(time,date,"8888888888888888888888888888888888888888888888888",)
  try {
    const tournaments = await TournamentModel.find({
      status: "pending",
      startDate: date,
      time: time,
    });

    for (const tournament of tournaments) {
      let tournamentId = tournament._id;
      let gameTime = tournament.gameTimeDuration;
      let roundNumber = 1;
      let noOfRounds = tournament.noOfRounds;
      let delayTime = tournament.delayTime;
      await startTournament(
        tournamentId,
        gameTime,
        roundNumber,
        noOfRounds,
        delayTime
      );
    }

    // const tournamentsdata = await TournamentModel.find({
    //   $expr: { $lte: [{ $size: "$players" }, 1] }, // Ensures array size <= 1
    //   startDate: date, // Matches the specific date
    //   time: { $lt: time }, // Matches times earlier than the given time
    //   status: "pending", // Ensures the status is "pending"
    // });

    // console.log(tournamentsdata, "players");

    // if (tournamentsdata.length > 0) {
    //   await TournamentModel.updateMany(
    //     { _id: { $in: tournamentsdata.map(t => t._id) } }, // Update matched tournaments
    //     { $set: { status: "suspended" } }
    //   );

    //   console.log(
    //     `${tournamentsdata.length} tournaments updated to 'suspended game'`
    //   );
    // } else {
    //   console.log("No tournaments matched the condition for update.");
    // }
  } catch (error) {
    console.error("Error starting pending tournaments:", error);
  }
});

module.exports = {
  createTournament,
  updateTournament,
  deleteTournament,
  getMyTournament,
  joinTournament,
  getTournamentByUserId,
  getTournamentById,
  adminNotification,
  startTournament,
  getUpcomingTournament,
  getpairPlayers,
  getOngoingmatch,
  getOngoingmatchData,
  getTournamentResult,
  getOngoingMatchDatas,
  getCompletedmatch,
  getPairedList,
  getJoinedCount,
  getboardNumberData,
  getDataByRoundIdAndNumber,
  userScoreDataForAdmin,
  getTime,
  getAllTournament,
  searchTournament,
  redirectUrl,
};
