require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { APP_PORT, DB_URL, SESSIONSECRET } = require("./config");
const mongoose = require("mongoose");
const passport = require("passport");
const axios = require("axios");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const Room = require("./models/room");
const Analysis = require("./models/Analysis");
const User = require("./models/userModel");
const cron = require("node-cron");
const Challenge = require("./models/ChallengeModel");
const Wallet = require("./models/walletModel");
const WalletHistory = require("./models/paymentHistoryModel");
const Match = require("./models/Tournament/Match");
const Round = require("./models/Tournament/Round");
const deleteUserRequest = require("./models/deleteUserListRequest");
const PlayerTournament = require("./models/Tournament/PlayersTournament");
const tournamentdatas = require("./models/Tournament/TournamentModel");
const activeJoinRequests = new Map(); // In-memory cache for join requests
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs
const session = require("express-session");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use("/public", express.static("public"));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(passport.session())


require("./middleware/passport")(passport);
require('./middleware/authenticate');
app.get("/ping", (req, res) => {
  res.send("PONG");
});
app.get("/", (req, res) => {
  res.send("hiiiiiiiii from the server");
});
const user_routes = require("./routes/userRoute");
const timeRoute = require("./routes/timeRoute");
const ruleRoute = require("./routes/ruleRoute");
const bannerRoute = require("./routes/bannerRoutes");
const ratingRoute = require("./routes/ratingRoutes");
const trainerRoute = require("./routes/trainerRoutes");
const matchRoute = require("./routes/matchRoute");
const postRoute = require("./routes/postRoute");
const membershipRoute = require("./routes/MembershipRoute");
const tournamentRoute = require("./routes/tournamentRoutes");
const Createchallenge = require("./routes/challengeRoutes");
const AnalysisRoute = require("./routes/analysisRoute");
const walletRoute = require("./routes/walletRoute");
const productRoute = require("./routes/productRoute");
const billingDetailsRoutes = require("./routes/billingDetailsRoutes");
const orderRoutes = require("./routes/orderRoute");
const PlayersTournament = require("./models/Tournament/PlayersTournament");

//user_routes
app.use("/api", user_routes);
app.use("/api", timeRoute);
app.use("/api", ruleRoute);
app.use("/api", bannerRoute);
app.use("/api", ratingRoute);
app.use("/api", trainerRoute);
app.use("/api", matchRoute);
app.use("/api", postRoute);
app.use("/api", membershipRoute);
app.use("/api", tournamentRoute);
app.use("/api", Createchallenge);
app.use("/api", AnalysisRoute);
app.use("/api", walletRoute);
app.use("/api", productRoute);
app.use("/api", billingDetailsRoutes);
app.use("/api", orderRoutes);



function ConvertDynamoCoinsToInr(dynamoCoins) {
  const conversionRate = 20; // 1 rs = 20 DynamoCoins
  return dynamoCoins / conversionRate;
}
function ConvertInrToDynamoCoins(rupees) {
  const conversionRate = 20; // 1 rs = 20 DynamoCoins
  return rupees * conversionRate;
}

async function ByePointCalculation(tournamentId, userId, roundId) {
  try {
    // console.log(
    //   tournamentId,
    //   userId,
    //   roundId,
    //   "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu"
    // );
    // const userObjectId = new mongoose.Types.ObjectId(userId);
    // Use findOne to get the actual document that can be modified
    const playerData = await PlayerTournament.findOne({
      tournamentId: new mongoose.Types.ObjectId(tournamentId),
      user: userId,
    });
    // console.log(playerData, "tytyytytytyty");
    // Fetch the roundNumber from the Round schema using the roundId
    const roundData = await Round.findOne({ _id: roundId });
    if (!roundData) {
      return res.status(404).json({ error: "Round not found" });
    }
    const roundNumber = roundData.roundNumber;
    // console.log(roundData, "Round data");

    // Fetch the match data based on tournamentId, userId, and roundId
    const matchData = await Match.findOne({
      tournamentId: tournamentId,
      $or: [{ user1: userId }, { user2: userId }],
      round: roundId,
    });

    if (!matchData) {
      return res.status(404).json({ error: "Match not found" });
    }
    console.log(matchData, "Match data");

    // Update the match result to 'completed'
    matchData.result = "completed";
    matchData.winner = userId;
    matchData.loser == "null";
    matchData.gameTypeWin = "Abort";
    await matchData.save();
    // Save the updated player data
    await playerData.save();
  } catch (error) {
    console.error("Error in ByePointCalculation:", error);
  }
}

// // update Rating with formula
function calculateRatingForWinner(ratingOfPlayer, ratingOpp, actualScore, K) {
  // Calculate the expected score
  const expectedScore = 1 / (1 + 10 ** ((ratingOpp - ratingOfPlayer) / 400));

  // Calculate the rating change
  const ratingChange = K * (actualScore - expectedScore);

  // Calculate the new rating
  const newRating = ratingOfPlayer + ratingChange;

  return newRating;
}

const updateRatings = async (player1, player2, coin) => {
  try {
    // console.log("hiiiiiiiiiiiiiiiii");
    // console.log(player1, player2, typeof coin, "Initial Player and Coin Info");
    // Find the users
    const user1 = await User.findOne({ _id: player1.playerId });
    const user2 = await User.findOne({ _id: player2.playerId });
    if (!user1 || !user2) {
      // console.log("One or both users not found.");
      return;
    }
    // Calculate netCoin
    let netCoin = 1.8 * coin;

    // Update dynamoCoin values
    user1.dynamoCoin += netCoin;
    user2.dynamoCoin -= coin;

    // Save the users and check for errors
    const userdata1 = await user1.save();
    const userdata2 = await user2.save();
    const inr1 = ConvertDynamoCoinsToInr(200);
    const inr2 = ConvertDynamoCoinsToInr(200);

    // Find wallets for the users
    const walletData1 = await Wallet.findOne({ userId: player1.playerId });
    const walletData2 = await Wallet.findOne({ userId: player2.playerId });

    if (!walletData1 || !walletData2) {
      console.log("One or both wallets not found.");
      return;
    }

    let dynamoCoin1 = userdata1.dynamoCoin;
    let dynamoCoin2 = userdata2.dynamoCoin;
    // Create and save wallet history entries
    const walletHistoryData1 = new WalletHistory({
      userId: userdata1._id,
      walletId: walletData1._id,
      userName: userdata1.name,
      userEmail: userdata1.email,
      type: "batting",
      balance: inr1,
      dynamoCoin: dynamoCoin1,
    });
    await walletHistoryData1.save();
    const walletHistoryData2 = new WalletHistory({
      userId: userdata2._id,
      walletId: walletData2._id,
      userName: userdata2.name,
      userEmail: userdata2.email,
      type: "batting",
      balance: inr2,
      dynamoCoin: dynamoCoin2,
    });
    await walletHistoryData2.save();

    const newRating1 = calculateRatingForWinner(
      user1.rating,
      user2.rating,
      1,
      20
    );
    const newRating2 = calculateRatingForWinner(
      user2.rating,
      user1.rating,
      0,
      20
    );
    user1.rating = newRating1;
    user2.rating = newRating2;
    await user1.save();
    await user2.save();
    // console.log(player1.playerId, player2.playerId, "999999999999999999");

    // Fetch and filter matches
    const matches = await Match.find({ result: "pending" });
    // console.log("All pending matches:", matches);

    const userData = matches.filter((match) => {
      return (
        match.user1.toString() === player1.playerId.toString() ||
        match.user2.toString() === player1.playerId.toString()
      );
    });

    // Process each match
    for (const user of userData) {
      // console.log(
      //   "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
      // );
      user.winner = player1.playerId;
      user.loser = player2.playerId;
      user.result = "completed";
      user.gameTypeWin = "notDraw";
      await user.save();
      // console.log("Updated match info for user:", user);
    }
  } catch (error) {
    console.error("Error updating ratings:", error);
  }
};
app.get("/update-activity/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by ID
    let user = await User.findById(id);
    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the last activity timestamp
    user.lastActivity = new Date();
    await user.save();
    res.status(200).json({ message: "Activity updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
app.get("/online-users", async (req, res) => {
  try {
    // Find users whose last activity is within the last 10 minutes
    const threshold = new Date(Date.now() - 60 * 60 * 1000); // 10 minutes ago
    const onlineUsers = await User.find({ lastActivity: { $gt: threshold } });
    if (onlineUsers.length > 0) {
      res.status(200).json(onlineUsers);
    } else {
      res.status(200).json({
        success: true,
        message: "No online users found",
        data: [],
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// crone job for updating the routes
cron.schedule("* * * * *", async () => {
  try {
    // Update all users' online status
    await User.updateMany(
      { lastActivity: { $gt: new Date(Date.now() - 10 * 60 * 1000) } },
      { $set: { online: true } }
    );

    // Set offline for users inactive for more than 10 minutes
    await User.updateMany(
      { lastActivity: { $lt: new Date(Date.now() - 10 * 60 * 1000) } },
      { $set: { online: false } }
    );
    // Find and delete expired challenges
    const expiredChallenges = await Challenge.find({
      expireTime: { $lt: new Date() },
      expired: false,
    });

    for (const challenge of expiredChallenges) {
      challenge.expired = true;
      await challenge.save();
      await Challenge.findByIdAndDelete(challenge._id);
    }

    // console.log("Online status updated");
  } catch (err) {
    console.error("Error updating online status:", err);
  }
});

app.post("/sendChallenges", async (req, res) => {
  const { from, to, joinLink } = req.body;
});

//============================= socket code ===============================================
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
// createPosition
const createPosition = () => {
  const position = new Array(10).fill("").map((x) => new Array(10).fill(""));
  for (let i = 0; i < 10; i++) {
    position[8][i] = "bp";
    position[1][i] = "wp";
  }
  position[0][0] = "wr";
  position[0][1] = "wn";
  position[0][2] = "wb";
  position[0][3] = "wm";
  position[0][4] = "wq";
  position[0][5] = "wk";
  position[0][6] = "wm";
  position[0][7] = "wb";
  position[0][8] = "wn";
  position[0][9] = "wr";
  position[9][0] = "br";
  position[9][1] = "bn";
  position[9][2] = "bb";
  position[9][3] = "bm";
  position[9][4] = "bq";
  position[9][5] = "bk";
  position[9][6] = "bm";
  position[9][7] = "bb";
  position[9][8] = "bn";
  position[9][9] = "br";
  return position;
};
const createPosition2 = () => {
  const position = new Array(10).fill("").map((x) => new Array(10).fill(""));
  for (let i = 0; i < 10; i++) {
    position[8][i] = "wp";
    position[1][i] = "bp";
  }
  position[0][0] = "br";
  position[0][1] = "bn";
  position[0][2] = "bb";
  position[0][3] = "bm";
  position[0][4] = "bq";
  position[0][5] = "bk";
  position[0][6] = "bm";
  position[0][7] = "bb";
  position[0][8] = "bn";
  position[0][9] = "br";
  position[9][0] = "wr";
  position[9][1] = "wn";
  position[9][2] = "wb";
  position[9][3] = "wm";
  position[9][4] = "wq";
  position[9][5] = "wk";
  position[9][6] = "wm";
  position[9][7] = "wb";
  position[9][8] = "wn";
  position[9][9] = "wr";
  return position;
};
let count = 0;
const deleteRoom = async (roomId) => {
  const storeRoomData = await Room.findById(roomId);
  // Store the room document in the Analysis collection
  await Analysis.create({ analysisData: storeRoomData });
  await Room.findByIdAndDelete(roomId);
};
const convertSecondsToMinutes = (totalSeconds) => {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  // Ensuring two digits for seconds
  let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};
const activeTimers = new Map(); // Store active timers per room
// console.log(data);
io.on("connection", async (socket) => {
  // let messages=[]
  console.log(`A user connected: ${socket.id}`);
  socket.on("joinRoom", async (body) => {
    try {
      const {
        playerId,
        name,
        coin,
        profileImageUrl,
        playerStatus,
        joinId,
        timer,
        countryicon,
      } = body;

      // console.log("Joining room with player:", name);
      const userData = await User.findById(playerId);
      if (!userData) {
        throw new Error("User not found");
      }
      const Rating = userData.rating;

      let roomId;
      let room;

      // Check if the player is already in a room
      const playerInRoom = await Room.aggregate([
        { $unwind: "$players" },
        { $match: { "players.playerId": playerId } },
        { $group: { _id: "$_id", room: { $first: "$$ROOT" } } },
      ]);

      if (playerInRoom.length > 0) {
        // console.log("Player already in a room");
        room = await Room.findById(playerInRoom[0]._id);
        roomId = room._id;

        if (room.players.length === 2) {
          io.to(socket.id).emit("JoinStatus", true);
          io.to(socket.id).emit("reJoinRoomData", room);
          io.to(socket.id).emit("moveList", room.moveList);
          socket.emit("nextPlayerTurn", {
            playerId: room.nextplayer,
            playerColour: room.nextPlayerColor,
          });
        } else if (room.players.length === 1) {
          if (room.players[0].playerId === playerId) {
            await Room.findByIdAndDelete(roomId);
          }
          createOrJoinRoom();
        }
      } else {
        createOrJoinRoom();
      }

      async function createOrJoinRoom() {
        const uniqueId = uuidv4(); // Generate a unique ID

        // Find an available room
        room = await Room.findOne({
          coin,
          isJoin: true,
          timer,
        });

        if (room) {
          // console.log("Found available room");
          room.players.push({
            socketID: socket.id,
            playerId,
            name,
            Rating,
            coin,
            profileImageUrl,
            playerStatus,
            colour: room.players.length === 0 ? "w" : "b",
            countryicon,
          });
          room.occupancy += 1;

          if (room.occupancy === 2) {
            room.isJoin = false;
          }

          roomId = room._id;
          await Room.findByIdAndUpdate(roomId, room);
          socket.join(roomId);
          io.to(roomId).emit("updatedPlayers", room.players);
          io.to(roomId).emit("updatedRoom", room);

          if (room.occupancy === 2) {
            io.to(roomId).emit("startGame", {
              start: true,
              playerId: room.players[1].playerId,
            });
            start(roomId);
          }
        } else {
          // console.log("Creating a new room");
          room = new Room({
            _id: uniqueId,
            coin,
            players: [
              {
                socketID: socket.id,
                playerId,
                name,
                Rating,
                coin,
                profileImageUrl,
                playerStatus,
                colour: "w",
                countryicon,
              },
            ],
            occupancy: 1,
            isJoin: true,
            joinId: uniqueId,
            timer,
          });

          await room.save();
          roomId = room._id;
          socket.join(roomId);
          io.to(roomId).emit("createRoomSuccess", room);
          io.to(roomId).emit("updatedRoom", room);
          io.to(roomId).emit("updatedPlayers", room.players);
        }
      }
    } catch (error) {
      console.error("Error in joinRoom:", error);
      socket.emit("joinRoomError", { error: error.message });
    }
  });
  socket.on("joinById", async (body) => {
    // console.log("ismai join hogya joinByid mai")
    let playerId = body.playerId;
    let name = body.name;
    // let Rating = body.Rating;
    let coin = body.coin;
    let profileImageUrl = body.profileImageUrl;
    let playerStatus = body.playerStatus;
    let joinId = body.joinId;
    let timer = body.timer;
    let countryicon = body.countryicon;
    let roomId;
    let room;
    const userData = await User.findById(playerId);
    // console.log(userData, "bbbbbbbbbbbbbbbbbbbbbbbbbb");
    let Rating = userData.rating;

    const playerInRoom = await Room.aggregate([
      { $unwind: "$players" },
      { $match: { "players.playerId": playerId } },
      { $group: { _id: "$_id", room: { $first: "$$ROOT" } } },
    ]);
    // console.log(playerInRoom, "playerInRoom")
    // console.log(playerInRoom, "playerInRoom")
    if (playerInRoom.length > 0) {
      // console.log("Player already in the room");
      roomId = playerInRoom[0]._id;
      room = await Room.findById(roomId);
      // console.log(room, "##################################");

      if (room.players.length == 2) {
        // console.log("Room is full, cannot join");
        for (let element of room.players) {
          if (element.playerId === playerId) {
            io.to(socket.id).emit("JoinStatus", true);
            room = await Room.findById(roomId);
            io.to(socket.id).emit("reJoinRoomData", room);
            io.to(socket.id).emit("moveList", room.moveList);

            socket.emit("nextPlayerTurn", {
              playerId: room.nextplayer,
              playerColour: room.nextPlayerColor,
            });
          }
          if (element.playerId != playerId) {
            io.to(socket.id).emit("JoinStatus", true);
            io.to(socket.id).emit("updatedRoom", room);
          }
        }
      } else if (room.players.length === 1) {
        if (room.players[0].playerId === playerId) {
          await Room.findByIdAndDelete(roomId);
        }
        skipJoining();
      }
    } else {
      skipJoining();
    }
    async function skipJoining() {
      // console.log(joinId, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

      if (coin > 0) {
        // console.log("hiiiiiiiiiii")

        // await sleep(1000)
        // Find a room with coin > 0 and isJoin == true
        room = await Room.aggregate([
          {
            $match: {
              coin: coin,
              isJoin: true,
              _id: joinId,
            },
          },
        ]);
        // console.log(room, "+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA++")
        if (room.length > 0) {
          // A suitable room is found, join the room
          // console.log(room, "++++++++++++ppppppp+++++++++++++");
          for (let element of room) {
            if (element.timer == timer) {
              room = element;
              // console.log(room, "+++++++jajajjajja++++++++")
              // console.log("+++++++++++kakakkakka+++++++++")
              break;
            }
          }
          // console.log(room, "uuuuuuuuuuuuuuuuuuuuuuuuuu");
          if (room) {
            // console.log("hiiiiiiiiiiiiiiiii");
            room.players.push({
              socketID: socket.id,
              playerId,
              name,
              Rating,
              coin,
              profileImageUrl,
              playerStatus,
              colour: "b",
              countryicon,
            });
            room.occupancy += 1;
            room.timer = timer;

            roomId = room._id.toString();
            if (room.occupancy >= 2) {
              room.isJoin = false;
              const data = createPosition();
              room.allBoardData.push({ newPosition: data });
            }
            await Room.findByIdAndUpdate(room._id, room);
            socket.join(roomId);
            socket.emit("roomJoined", { roomId: room._id });
            io.to(roomId).emit("updatedPlayers", room.players);
            io.to(roomId).emit("updatedRoom", room);
            if (room.occupancy >= 2) {
              io.to(roomId).emit("startGame", {
                start: true,
                playerId: room.players[1].playerId,
              });

              start(roomId);
            }
          } else {
            // console.log("second else ma aagayaaaa")
            // No suitable room found, create a new room
            const newRoom = new Room({
              _id: joinId, // Set _id explicitly to joinId
              coin: coin,
              players: [
                {
                  socketID: socket.id,
                  playerId,
                  name,
                  Rating,
                  coin,
                  profileImageUrl,
                  playerStatus,
                  colour: "w",
                  countryicon,
                },
              ],
              occupancy: 1,
              joinId: joinId,
              timer: timer,
            });

            await newRoom.save();
            roomId = newRoom._id.toString();
            socket.join(roomId);
            socket.emit("roomJoined", { roomId: newRoom._id });
            room = await Room.findById(roomId);

            io.to(roomId).emit("createRoomSuccess", room);
            io.to(roomId).emit("updatedRoom", room);
            io.to(roomId).emit("updatedPlayers", room.players);
            socket.broadcast.emit("newPlayerJoined", {
              playerId,
              name,
              Rating,
              coin,
              profileImageUrl,
              playerStatus,
              countryicon,
            });
          }
        } else {
          // console.log("++++++++++++ismai kahe nahi ghusaaaaaaaaa+++++++++");
          // No suitable room found, create a new room
          const newRoom = new Room({
            _id: joinId, // Set _id explicitly to joinId
            coin: coin,
            players: [
              {
                socketID: socket.id,
                playerId,
                name,
                Rating,
                coin,
                profileImageUrl,
                playerStatus,
                colour: "w",
                countryicon,
              },
            ],
            occupancy: 1,
            joinId: joinId,
            timer: timer,
          });

          await newRoom.save();
          roomId = newRoom._id.toString();
          socket.join(roomId);
          socket.emit("roomJoined", { roomId: newRoom._id });
          room = await Room.findById(roomId);

          io.to(roomId).emit("createRoomSuccess", room);
          io.to(roomId).emit("updatedRoom", room);
          io.to(roomId).emit("updatedPlayers", room.players);
          socket.broadcast.emit("newPlayerJoined", {
            playerId,
            name,
            Rating,
            coin,
            profileImageUrl,
            playerStatus,
            countryicon,
          });
        }
      }
    }
  });

  socket.on("joinRoomViaTournament", async (body) => {
    let playerId = body.playerId;
    let name = body.name;
    // let Rating = body.Rating;
    let coin = body.coin;
    let profileImageUrl = body.profileImageUrl;
    let playerStatus = body.playerStatus;
    let joinId = body.joinId;
    let timer = body.timer;
    let countryicon = body.countryicon;
    let colour = body.colour;
    let roomId;
    let room;
    const userData = await User.findById(playerId);
    // console.log(userData, "bbbbbbbbbbbbbbbbbbbbbbbbbb");
    let Rating = userData.rating;
    // console.log(
    //   "++++++++++++++++++++++++++++++++joinId++++++++++++++++++++++++++++++++  aaayyaaaaaaaaa kyaaaaaaaaaaaaaaaaaaa",
    //   joinId,name
    // );
    const playerInRoom = await Room.findOne({ joinId });
    // console.log(
    //   playerInRoom,name,
    //   "+++++++++++++++++playerInRoom++++++++++++++++++++"
    // );
    if (playerInRoom) {
      // console.log("Player already in the room");
      // console.log(joinId, "yyyyyyyyyyyy");
      const roomData = await Room.findOne({ joinId });
      // console.log(roomData, "uuuuuuuuuuuuuuuuuuuuuuuuuuu");
      roomId = roomData._id;
      room = await Room.findById(roomId);
      // console.log(room, roomId, "+++++++Tournament Data++++++++++++");
      if (room.players.length == 2) {
        // console.log("Tournament Room is full, cannot join");
        for (let element of room.players) {
          if (element.playerId === playerId) {
            // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");
            io.to(socket.id).emit("JoinStatus", true);
            room = await Room.findById(roomId);
            io.to(socket.id).emit("reJoinRoomData", room);
            // allboarddata,nextPlayerTurn,color
            io.to(socket.id).emit("moveList", room.moveList);

            socket.emit("nextPlayerTurn", {
              playerId: room.nextplayer,
              playerColour: room.nextPlayerColor,
            });
          }

          if (element.playerId != playerId) {
            // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            io.to(socket.id).emit("JoinStatus", true);
            io.to(socket.id).emit("updatedRoom", room);
          }
        }
      }

      if (room.players.length === 1) {
        if (room.players[0].playerId === playerId) {
          await Room.findByIdAndDelete(roomId);
          // console.log(
          //   "ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt"
          // );
        }

        skipJoining();
      }
    } else {
      skipJoining();
    }
    async function skipJoining() {
      if (coin > 0) {
        try {
          // Create a queue for the joinId if it doesn't exist
          if (!activeJoinRequests.has(joinId)) {
            activeJoinRequests.set(joinId, []);
          }

          // Push the current request into the queue
          const queue = activeJoinRequests.get(joinId);
          const requestPromise = new Promise(async (resolve) => {
            queue.push(resolve);

            // If this is not the first request in the queue, wait for the previous one
            if (queue.length > 1) {
              await queue[queue.length - 2]; // Wait for the previous request
            }

            try {
              // Atomic operation: find or create a room
              const existingRoom = await Room.findOneAndUpdate(
                { _id: joinId }, // Query by _id
                {
                  $setOnInsert: {
                    _id: joinId,
                    coin: coin,
                    players: [
                      {
                        socketID: socket.id,
                        playerId,
                        name,
                        Rating,
                        coin,
                        profileImageUrl,
                        playerStatus,
                        colour,
                        countryicon,
                      },
                    ],
                    occupancy: 1,
                    timer: timer,
                    isJoin: true,
                  },
                },
                { upsert: true, new: true } // Create a new room if it doesn't exist
              );

              // Check if room was newly created or retrieved
              if (
                existingRoom.occupancy === 1 &&
                existingRoom.players[0].playerId === playerId
              ) {
                // New room created
                // console.log("Created a new room:", existingRoom._id);
                const roomId = existingRoom._id.toString();
                socket.join(roomId);
                io.to(roomId).emit("createRoomSuccess", existingRoom);
                io.to(roomId).emit("updatedRoom", existingRoom);
                io.to(roomId).emit("updatedPlayers", existingRoom.players);
              } else {
                // Room already exists
                // console.log("Joining existing room:", existingRoom._id);

                // Check if player is already in the room
                const playerExists = existingRoom.players.some(
                  (player) => player.playerId === playerId
                );

                if (playerExists) {
                  // console.log("Player already exists in the room.");
                  socket.join(existingRoom._id.toString());
                  io.to(socket.id).emit("JoinStatus", true);
                  io.to(socket.id).emit("reJoinRoomData", existingRoom);
                } else {
                  // Add the player to the room
                  existingRoom.players.push({
                    socketID: socket.id,
                    playerId,
                    name,
                    Rating,
                    coin,
                    profileImageUrl,
                    playerStatus,
                    colour,
                    countryicon,
                  });
                  existingRoom.occupancy += 1;

                  if (existingRoom.occupancy >= 2) {
                    existingRoom.isJoin = false;
                    const data = createPosition();
                    existingRoom.allBoardData.push({ newPosition: data });
                  }

                  await existingRoom.save();
                  const roomId = existingRoom._id.toString();
                  socket.join(roomId);

                  io.to(roomId).emit("updatedPlayers", existingRoom.players);
                  io.to(socket.id).emit("JoinStatus", true);
                  io.to(roomId).emit("updatedRoom", existingRoom);

                  if (existingRoom.occupancy >= 2) {
                    io.to(roomId).emit("startGame", {
                      start: true,
                      playerId: existingRoom.players[1].playerId,
                    });
                    start(roomId);
                  }
                }
              }
            } catch (error) {
              console.error("Error during skipJoining:", error);
              io.to(socket.id).emit(
                "error",
                "An error occurred while joining the room."
              );
            } finally {
              // Resolve the current request and remove it from the queue
              queue.shift(); // Remove the current request from the queue
              if (queue.length === 0) {
                activeJoinRequests.delete(joinId); // Clean up the map if no requests are left
              }
            }
          });

          await requestPromise; // Wait for the current request to finish
        } catch (error) {
          console.error("Unhandled error during skipJoining:", error);
        }
      }
    }
  });

  const start = async (roomId) => {
    try {
      console.log("Start room function called");

      let room = await Room.findById(roomId);
      if (!room) {
        io.to(roomId).emit("errorOccurred", "Invalid Room ID");
        return;
      }

      // Ensure Player 1 is always White
      if (room.players[0].colour === "b") {
        [room.players[0], room.players[1]] = [room.players[1], room.players[0]];
      }

      // Set up game state
      room.playerList = room.players.map((p) => p.playerId);
      room.timer1 = room.timer;
      room.timer2 = room.timer;
      room.nextplayer = room.players[0].playerId;
      room.nextPlayerColor = "w";

      await room.save();

      // Emit initial game state
      io.to(roomId).emit("updatedRoom", room);
      io.to(roomId).emit("createPosition", {
        createPosition: createPosition(),
        positions: [
          {
            createPosition2: createPosition2(),
            playerId: room.players[1].playerId,
          },
        ],
      });

      io.to(roomId).emit("nextPlayerTurn", {
        playerId: room.players[0].playerId,
        playerColour: "w",
      });

      // Start the first player's timer
      startTimer(roomId, room.nextplayer, "timer1");
    } catch (error) {
      console.error("Error in start function:", error);
    }
  };

  socket.on("boardUpdate", async (body) => {
    try {
      const { roomId, boardData, playerId, move } = body;
      let room = await Room.findById(roomId);

      if (!room || room.nextplayer !== playerId) return;

      let currentPlayerIndex = room.players.findIndex(
        (p) => p.playerId === playerId
      );
      let nextPlayerIndex = 1 - currentPlayerIndex;

      // Update game state
      room.players[currentPlayerIndex].strikeDone = true;
      room.nextplayer = room.players[nextPlayerIndex].playerId;
      room.nextPlayerColor = room.players[nextPlayerIndex].colour;
      room.moveList.push(move);
      room.repetationArray.push(move);

     
      if (room.repetationArray.length == 9) {
        function func3(arr) {
          if (arr[0] === arr[4] && arr[4] === arr[8] && arr[1] === arr[5]) {
            return true;
          }
          return false;
        }
        const result = func3(room.repetationArray);
        // console.log(result);
        if (result == true) {
          room.threefoldCount += 1;
          room = await room.save();
          if (room.threefoldCount == 1) {
            io.to(roomId).emit("ThreeFold", { message: true });
          }
          if (room.threefoldCount == 5) {
            io.to(roomId).emit("fiveFoldData", { message: true });
            io.to(roomId).emit("DrawStatus", { DrawStatus: true });
            //deleteRoom(roomId);
          }

          room.repetationArray.shift();
          room = await room.save();
        } else {
          room.threefoldCount = 0;
          room.repetationArray.shift();
          room = await room.save();
        }
      }

      // Store board data
      let reversedBoardData = {
        newPosition: [...boardData.newPosition].reverse(),
      };
      room.allBoardData.push(
        currentPlayerIndex === 0 ? boardData : reversedBoardData
      );

      await room.save(); // ? Save changes BEFORE emitting

      // Emit updates to players
      io.to(roomId).emit("moveList", room.moveList);
      room.players.forEach((p) => {
        io.to(p.socketID).emit("receive_boardData", {
          playerId: p.playerId,
          playerColour: p.colour,
          data: p.playerId === playerId ? boardData : reversedBoardData,
        });
      });

      // ? Ensure `nextPlayerTurn` is emitted after room is saved
      io.to(roomId).emit("nextPlayerTurn", {
        playerId: room.nextplayer,
        playerColour: room.nextPlayerColor,
      });
      // If a player runs out of time, they lose
if (room.timer1 <= 1) {
  io.to(roomId).emit("playerWon", {
    playerId: room.players[1].playerId,
  });
  room.winner = room.players[1].playerId;
  updateRatings(room.players[1], room.players[0], room.coin);
  await room.save();
  stopGame(roomId, room.players[1].playerId);
  return;
}
if (room.timer1 === 59) {
  io.to(roomId).emit("timerIs60", {
    successfully: true,
    playerId: room.players[0].playerId,
  });
}
if (room.timer2 <= 1) {
  io.to(roomId).emit("playerWon", {
    playerId: room.players[0].playerId,
  });
  room.winner = room.players[0].playerId;
  updateRatings(room.players[0], room.players[1], room.coin);
  await room.save();
  stopGame(roomId, room.players[0].playerId);
  return;
}
if (room.timer2 === 59) {
  io.to(roomId).emit("timerIs60", {
    successfully: true,
    playerId: room.players[1].playerId,
  });
}

      // Restart Timer
      stopTimer(roomId);
      startTimer(
        roomId,
        room.nextplayer,
        nextPlayerIndex === 0 ? "timer1" : "timer2"
      );
    } catch (error) {
      console.error("Error in boardUpdate function:", error);
    }
  });

  // ?? Get Board Data (History Navigation)
  socket.on("getBoardDate", async (body) => {
    try {
      const {
        roomId,
        next,
        previous,
        indexNumber,
        endIndex,
        startIndex,
        playerId,
      } = body;
      let room = await Room.findById(roomId);

      if (!room) return io.to(roomId).emit("errorOccurred", "Invalid Room ID");

      let socketId = room.players.find(
        (p) => p.playerId === playerId
      )?.socketID;
      if (!socketId) return;

      if (previous && room.currentIndex > 0) {
        room.currentIndex--;
        io.to(socketId).emit(
          "boardAtPreviousIndex",
          room.allBoardData[room.currentIndex]
        );
      } else if (next && room.currentIndex < room.allBoardData.length - 1) {
        room.currentIndex++;
        io.to(socketId).emit(
          "boardAtNextIndex",
          room.allBoardData[room.currentIndex]
        );
      } else if (indexNumber !== undefined) {
        room.currentIndex = indexNumber;
        io.to(socketId).emit("boardAtIndex", room.allBoardData[indexNumber]);
      } else if (startIndex) {
        room.currentIndex = 0;
        io.to(socketId).emit("boardAtStartIndex", room.allBoardData[0]);
      } else if (endIndex) {
        room.currentIndex = room.allBoardData.length - 1;
        io.to(socketId).emit(
          "boardAtFinalIndex",
          room.allBoardData[room.currentIndex]
        );
      }

      await room.save();

      io.to(roomId).emit("nextPlayerTurn", {
        playerId: room.nextplayer,
        playerColour: room.nextPlayerColor,
      });
    } catch (error) {
      console.error("Error in getBoardDate function:", error);
    }
  });

  const startTimer = (roomId, playerId, timerKey) => {
    stopTimer(roomId); // Clear existing timer

    const updateTimer = async () => {
        let room = await Room.findById(roomId);
        if (!room) {
            console.warn(`Room ${roomId} not found. Stopping timer.`);
            stopTimer(roomId);
            return;
        }

        // if (room.nextplayer !== playerId || room[timerKey] <= 0) {
        //     let opponent = room.players?.find((p) => p.playerId !== playerId)?.playerId;
        //     return stopGame(roomId, opponent);
        // }

        // Store the last update time
        room.lastTimerUpdate = Date.now();
        await room.save();

        io.to(roomId).emit(timerKey, convertSecondsToMinutes(room[timerKey]));

        room[timerKey] -= 1;
        await room.save();
        if (room.timer1 <= 0) {
          io.to(roomId).emit("playerWon", {
            playerId: room.players[1].playerId,
          });
          room.winner = room.players[1].playerId;
          updateRatings(room.players[1], room.players[0], room.coin);
          await room.save();
          stopGame(roomId, room.players[1].playerId);
          return;
        }
        if (room.timer1 === 59) {
          io.to(roomId).emit("timerIs60", {
            successfully: true,
            playerId: room.players[0].playerId,
          });
        }
        if (room.timer2 <= 0) {
          io.to(roomId).emit("playerWon", {
            playerId: room.players[0].playerId,
          });
          room.winner = room.players[0].playerId;
          updateRatings(room.players[0], room.players[1], room.coin);
          await room.save();
          stopGame(roomId, room.players[0].playerId);
          return;
        }
        if (room.timer2 === 59) {
          io.to(roomId).emit("timerIs60", {
            successfully: true,
            playerId: room.players[1].playerId,
          });
        }

        let timer = setTimeout(updateTimer, 1000);
        activeTimers.set(roomId, timer);
    };

    updateTimer();
};


  const stopTimer = (roomId) => {
    if (activeTimers.has(roomId)) {
      clearTimeout(activeTimers.get(roomId));
      activeTimers.delete(roomId);
    }
  };

  const stopGame = async (roomId, winnerId = null) => {
    try {
        let room = await Room.findById(roomId);
        if (!room) return;

        // Stop active timer
        stopTimer(roomId);

        // Emit game over event
        io.to(roomId).emit("gameOver", { winnerId });

        // Delete room after a short delay to allow clients to process
        setTimeout(async () => {
            await deleteRoom(roomId);
            console.log(`Room ${roomId} deleted`);
        }, 3000);
    } catch (error) {
        console.error("Error in stopGame:", error);
    }
};


  socket.on("reconnect", async (body) => {
    try {
      console.log("++++++++++reconnect hoagaya+++++++++++")
        let { roomId, playerId } = body;
        let room = await Room.findById(roomId);

        if (!room) {
            io.to(socket.id).emit("errorOccurred", "Room not found");
            return;
        }

        // If the game is already over, do not restart the timer
        if (room.isGameOver) {
            io.to(socket.id).emit("gameOver", { winnerId: room.winnerId || null });
            return;
        }

        // Calculate time difference since last update
        let timeElapsed = Math.floor((Date.now() - room.lastTimerUpdate) / 1000);
        if (timeElapsed > 0) {
            room[room.nextplayer === room.players[0].playerId ? "timer1" : "timer2"] -= timeElapsed;
            await room.save();
        }

        // Send updated game state to the reconnected player
        io.to(socket.id).emit("updatedRoom", room);
        io.to(socket.id).emit("moveList", room.moveList);
        io.to(socket.id).emit("allBoardData", room.allBoardData);

        io.to(socket.id).emit("nextPlayerTurn", {
            playerId: room.nextplayer,
            playerColour: room.nextPlayerColor,
        });

        // Restart the timer for the reconnected player
        startTimer(roomId, room.nextplayer, room.nextplayer === room.players[0].playerId ? "timer1" : "timer2");

    } catch (error) {
        console.error("Error handling reconnect:", error);
    }
});
const reconnect =async(room_Id,socket_id) => {
  try {
    console.log("++++++++++reconnect hoagaya+++++++++++")
     let roomId=room_Id
     let socketId=socket_id
      let room = await Room.findById(roomId);

      if (!room) {
          io.to(socket.id).emit("errorOccurred", "Room not found");
          return;
      }

      // If the game is already over, do not restart the timer
      if (room.isGameOver) {
          io.to(socket.id).emit("gameOver", { winnerId: room.winnerId || null });
          return;
      }

      // Calculate time difference since last update
      let timeElapsed = Math.floor((Date.now() - room.lastTimerUpdate) / 1000);
      if (timeElapsed > 0) {
          room[room.nextplayer === room.players[0].playerId ? "timer1" : "timer2"] -= timeElapsed;
          await room.save();
      }

      // Send updated game state to the reconnected player
      io.to(socketId).emit("updatedRoom", room);
      io.to(socketId).emit("moveList", room.moveList);
      io.to(socketId).emit("allBoardData", room.allBoardData);

      io.to(socketId).emit("nextPlayerTurn", {
          playerId: room.nextplayer,
          playerColour: room.nextPlayerColor,
      });

      // Restart the timer for the reconnected player
      startTimer(roomId, room.nextplayer, room.nextplayer === room.players[0].playerId ? "timer1" : "timer2");

  } catch (error) {
      console.error("Error handling reconnect:", error);
  }
};



  socket.on("clearAll", async () => {
    try {
      await Room.deleteMany({});
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("clearRoom", async (body) => {
    try {
      var roomId = body.roomId;
      let room = await Room.findById(roomId);
      if (room == null) {
        socket.emit("errorOccured", "Room not found");
        return;
      }

      await Room.deleteOne({ _id: roomId });
    } catch (e) {
      console.log(e);
    }
  });
//   socket.on("leaveRoom", async (body) => {
//     try {
//       const { roomId, playerId, challengeId } = body;
//       let room = await Room.findById(roomId);
//       if (!room) {
//         socket.emit("errorOccurred", "Room not found");
//         return;
//       }
// // console.log("leave room socket called")

//       let playerIndex = room.players.findIndex((p) => p.playerId === playerId);
//       if (playerIndex === -1) return;

     

//       // Determine the winner and update ratings
//       let winner = room.players[1 - playerIndex]; // Get the other player
//       let loser = room.players[playerIndex];

//       io.to(roomId).emit("playerWon", { playerId: winner.playerId });

//       room.winner = winner.playerId;
//       updateRatings(winner, loser, room.coin);

//       if (playerIndex === 0) room.isLeftPLayer1 = true;
//       else room.isLeftPLayer2 = true;

//       room.players = room.players.filter((p) => p.playerId !== playerId);
//       await room.save();

//       io.to(roomId).emit("roomLeftPlayerId", { playerId });

//        // If only one player is in the room, delete it
//        if (room.players.length === 1) {
//         stopTimer(roomId);
//         await deleteRoom(roomId);
        
//         return;
//       }

//       // Clean up the room if empty
//       if (room.players.length === 0) {
//         stopTimer(roomId);
//         await deleteRoom(roomId);
//       }

//       // Delete associated challenge if it exists
//       let challenge = await Challenge.findOne({ challengeId });
//       if (challenge) {
//         await Challenge.deleteOne({ _id: challenge._id });
//       }
//     } catch (error) {
//       console.error("Error in leaveRoom event:", error);
//     }
//   });


  socket.on("leaveRoom", async (body) => {
    let roomId = body.roomId;
    let playerId = body.playerId;
    let challengeId = body.challengeId;
    // console.log(roomId, playerId, challengeId, "adaddadadadadad");
    let room = await Room.findById(roomId);

    if (room == null) {
      socket.emit("errorOccured", "Room not found");
      return;
    }

    // const playerIndex = room.players.indexOf((player) => {
    //     player.playerId == playerId
    // })
    let playerIndex;
    let socketID;
    let count = 0;

    for (let element of room.players) {
      if (element.playerId == playerId) {
        playerIndex = count;
        break;
      }
      count++;
    }

    

    if (room.players.length == 1) {
      await Room.findByIdAndDelete(roomId);
      return;
    }
   
    if (playerIndex == 0) {
      // console.log("+++++++++++++++++");
      io.to(roomId).emit("playerWon", { playerId: room.players[1].playerId });
      room.winner = room.players[1].playerId;
     
      updateRatings(room.players[1], room.players[0], room.coin);
      room = await room.save();
      // console.log("bababab");
      room.isLeftPLayer1 = true;
    } else {
      // console.log("bbiiiiiiii");

      io.to(roomId).emit("playerWon", { playerId: room.players[0].playerId });
      room.winner = room.players[0].playerId;
      updateRatings(room.players[0], room.players[1], room.coin);
      room = await room.save();
      // console.log("afafafafa");
      room.isLeftPLayer2 = true;
    }
    room = await room.save();
    io.to(roomId).emit("roomLeftPlayerId", { playerId: playerId });
    room = await room.save();
    room.players = room.players.filter((player) => {
      return player.playerId != playerId;
    });
    deleteRoom(roomId);
    let challegeRoom = await Challenge.aggregate([
      { $match: { challengeId: challengeId } },
    ]);
    // console.log(challegeRoom, "lalalalal");
    if (challegeRoom) {
      let challengeId = challegeRoom[0]._id;
      await Challenge.deleteOne({ _id: challengeId });
    }
  });
  socket.on("disconnect", async () => {
    try {
      console.log(`A user disconnected: ${socket.id}`);

      let rooms = await Room.find({ "players.socketID": socket.id });
// let socketId=socket.id
   
      // for (let room of rooms) {
      //   let player = room.players.find((p) => p.socketID === socket.id);
      //   if (player) {
      //     await reconnect(room._id.toString(),socketId);
      //     break; // Stop once the player is found & processed
      //   }
      // }

       for (let room of rooms) {
        let player = room.players.find((p) => p.socketID === socket.id);
        if (player) {
          await LeaveRoom(room._id.toString(), player.playerId);
          break; // Stop once the player is found & processed
        }
      }
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  async function LeaveRoom(roomId, playerId) {
    let room = await Room.findById(roomId);
    if (!room) {
        socket.emit("errorOccurred", "Room not found");
        return;
    }
    console.log("leaveRoomCalledBy function",roomId,playerId)

    let playerIndex = room.players.findIndex(p => p.playerId === playerId);
    if (playerIndex === -1) return;

 

    // Determine winner and update rating
    let winnerIndex = playerIndex === 0 ? 1 : 0;
    io.to(roomId).emit("playerWon", { playerId: room.players[winnerIndex].playerId });
    room.winner = room.players[winnerIndex].playerId;
    updateRatings(room.players[winnerIndex], room.players[playerIndex], room.coin);

    // Remove the player who left
    room.players.splice(playerIndex, 1);
    await room.save(); // ?? Must save before calling deleteRoom
   // If only one player was in the room, delete it
  
    
 // Emit event that a player left
    io.to(roomId).emit("roomLeftPlayerId", { playerId });

    // Ensure the game stops
    stopGame(roomId);
    console.log(`Deleting room ${roomId} as the last player left.`);
    stopTimer(roomId);
    await deleteRoom(roomId);
    return;
}

  socket.on("moveList", async (body) => {
    let postion = body.postion;
    // let finalPostion=body.finalPostion
    let roomId = body.roomId;
    // let room=await Room.findById(roomId)
    io.to(roomId).emit("postion", postion);
  });
  // ?? Abort Game
  socket.on("Abort", async (body) => {
    try {
      const { roomId, tournamentId, userId, roundId } = body;
      io.to(roomId).emit("abort", "Draw");

      stopGame(roomId);

      await ByePointCalculation(tournamentId, userId, roundId);
    } catch (error) {
      console.error("Error in Abort event:", error);
    }
  });

  // ?? Checkmate
  socket.on("CheckMate", async (body) => {
    try {
      const { roomId, playerId } = body;
      let room = await Room.findById(roomId);
      if (!room) return;

      io.to(roomId).emit("playerWon", { playerId });

      let winner = room.players.find((p) => p.playerId === playerId);
      let loser = room.players.find((p) => p.playerId !== playerId);

      updateRatings(winner, loser, room.coin);
      room.winner = winner.playerId;
      room.checkMate = true;

      await room.save();

      stopGame(roomId);
    } catch (error) {
      console.error("Error in CheckMate event:", error);
    }
  });

  socket.on("send_message", (body) => {
    try {
      let roomId = body.roomId;
      let message = body.message;
      let playerId = body.playerId;

      socket.join(roomId);
      io.to(roomId).emit("receive_message", { message, playerId });
    } catch (error) {
      console.log("send_message_______err", error);
    }
  });
  socket.on("Draw", async (body) => {
    let roomId = body.roomId;
    let playerId = body.playerId;
    let room = await Room.findById(roomId);
    if (room.players[0].playerId == playerId) {
      let socketId = room.players[1].socketID;
      io.to(socketId).emit("DrawMessage", {
        message: "your opponent offers a draw",
      });
    }
    if (room.players[1].playerId == playerId) {
      let socketId = room.players[0].socketID;
      io.to(socketId).emit("DrawMessage", {
        message: "your opponent offers a draw",
      });
    }
  });
  socket.on("DrawStatus", async (body) => {
    let roomId = body.roomId;
    // let playerId=room.playerId
    let DrawStatus = body.DrawStatus;
    let room = await Room.findById(roomId);

    if (DrawStatus == true) {
      room.DrawStatus = true;
      room.winner = "Draw";
      room = await room.save();
      io.to(roomId).emit("DrawStatus", { DrawStatus: true });
      // const storeRoomData = await Room.findById(roomId);
      // Store the room document in the Analysis collection
      // await Analysis.create({ analysisData: storeRoomData });

      deleteRoom(roomId);
    } else {
      room.DrawStatus = false;
      room = await room.save();
      io.to(roomId).emit("DrawStatus", { DrawStatus: false });
    }
  });
  socket.on("getAnalysisBoard", async (body) => {
    let roomId = body.roomId;
    let roomAnalysis = await Analysis.find();

    let playerId = body.playerId;
    let socketId;
    // console.log(roomId, playerId, "jjjjjjjjjjjjj");

    for (let element of roomAnalysis) {
      if (element.analysisData[0]._id == roomId) {
        roomAnalysis = element.analysisData[0];
        for (let i = 0; i < element.analysisData[0].players.length; i++) {
          if (element.analysisData[0].players[i].playerId == playerId) {
            socketId = element.analysisData[0].players[i].socketID;
            io.emit("analysisBoard", roomAnalysis);
            break;
          }
        }
      }
    }

    // console.log(roomAnalysis, "papapap");
  });
  socket.on("notifications", async (data) => {
    // Expecting 'data' to contain the properties that would normally be in req.body
    const { userId } = data;
    if (!userId) {
      console.log("User ID is not provided");
      return;
    }
    // console.log(userId, "fffffff");
    try {
      const notifications = await Challenge.find({ toUserId: userId })
        .sort({ createdAt: -1 })
        .limit(5);
      // console.log(notifications);

      io.emit("notifications_msg", notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      io.emit("notifications_error", {
        message: "Error fetching notifications",
      });
    }
  });
  socket.on("sendChallenges", async (req, res) => {
    const { from, to, joinLink } = req.body;
  });
  socket.on("rematch", async (body) => {
    let playerId = body.playerId;
    let roomId = body.roomId;
    // console.log(roomId, playerId, "ajajjajaj");
    let room = await Room.findById(roomId);

    if (room.players[0].playerId == playerId) {
      let socketId = room.players[1].socketID;
      io.to(socketId).emit("rematch", true);
    } else {
      let socketId = room.players[0].socketID;
      io.to(socketId).emit("rematch", true);
    }
  });
  socket.on("rematchStatus", async (body) => {
    var randomRoomId = Math.floor(Date.now() / 1000).toString();
    let rematchResponse = body.rematchResponse;
    let roomId = body.roomId;
    let room = await Room.findById(roomId);
    if (rematchResponse == true) {
      io.to(roomId).emit("rematchResponse", randomRoomId);
    } else {
      io.to(roomId).emit("rematchResponse", false);
    }
  });

  socket.on("threefoldCancel", async (body) => {
    let roomId = body.roomId;
    let threefold = body.threefold;
    let roundId = body.roundId;
    let userId = body.userId;
    // console.log(threefold, roundId,roomId,"jjjjjjjjjj");
    let room = await Room.findById(roomId);
    if (threefold == false) {
      io.to(roomId).emit("threefoldCancel", true);
    }
    if (threefold == true) {
      room.DrawStatus = true;
      room = await room.save();
      io.to(roomId).emit("threefoldStatus", { threefoldStatus: true });

      const match = await Match.findOne({
        round: roundId, // Match the round ID
        $or: [
          { user1: userId }, // Check if userId matches user1
          { user2: userId }, // Check if userId matches user2
        ],
      });

      if (match) {
        // Update match fields
        match.result = "completed";
        match.gameTypeWin = "Draw";

        // Save the updated match data
        await match.save();

        // console.log(match, "Updated Match Data");
      } else {
        console.error("Match not found for the given roundId");
      }
      io.to(roomId).emit("DrawStatus", { DrawStatus: true });

      // console.log(match,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
      deleteRoom(roomId);
    }
  });
  socket.on("threefoldRequest", async (body) => {
    let roomId = body.roomId;
    let playerId = body.playerId;
    // console.log(playerId, "hhhhhhh");
    let room = await Room.findById(roomId);
    if (room.players[0].playerId == playerId) {
      let socketId = room.players[1].socketID;
      io.to(socketId).emit("threefoldRequest", {
        message: "your opponent offers a threeFold Drew",
      });
    }
    if (room.players[1].playerId == playerId) {
      let socketId = room.players[0].socketID;
      io.to(socketId).emit("threefoldRequest", {
        message: "your opponent offers a threeFold Drew",
      });
    }
  });

  socket.on("turnBack", async (body) => {
    let roomId = body.roomId;
    let playerId = body.playerId;
    let room = await Room.findById(roomId);
    room.turnBackPlayer = playerId;
    // console.log(
    //   "++++++++++sbbsbsbsbsbsbbsbsbbsb+++++++++++++",
    //   roomId,
    //   playerId
    // );
    if (room.players[0].playerId === playerId) {
      room.turnBackPlayerColor = "w";
    } else {
      room.turnBackPlayerColor = "b";
    }
    room = await room.save();
    if (room.players[0].playerId == playerId) {
      let socketId = room.players[1].socketID;
      io.to(socketId).emit("turnBack", true);
    } else {
      let socketId = room.players[0].socketID;
      io.to(socketId).emit("turnBack", true);
    }
    // console.log(room.nextplayer, "ttttttttttttttt", room.turnBackPlayer);
  });
  socket.on("turnBackStatus", async (body) => {
    let roomId = body.roomId;
    let turnBack = body.turnBack;
    let playerId = body.playerId;
    let room = await Room.findById(roomId);
    // console.log(
    //   "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    // );

    if (room.turnBackPlayer == room.nextplayer) {
      if (playerId != room.nextplayer) {
        if (room.players[0].playerId == room.nextplayer) {
          room.players[0].strikeDone = true;
        } else {
          room.players[1].strikeDone = true;
        }
      }
    } else {
      if (room.players[0].playerId === playerId) {
        room.players[0].strikeDone = true;
      } else if (room.players[1].playerId === playerId) {
        room.players[1].strikeDone = true;
      }
    }
    room = await room.save();
    if (turnBack == true) {
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      io.to(roomId).emit("turnBackStatus", { turnBackStatus: true });
      // console.log(room.nextplayer, "ttttttttttttttt", room.turnBackPlayer);
      if (room.nextplayer === room.turnBackPlayer) {
        room.moveList = room.moveList.slice(0, room.moveList.length - 2);
        room.nextplayer = room.turnBackPlayer;
        room.allBoardData = room.allBoardData.slice(
          0,
          room.allBoardData.length - 2
        );

        // console.log(room.allBoardData.length - 1,"gggggggggggggggggggggggggggggggggggg")
        let data1 = room.allBoardData[room.allBoardData.length - 1] || {
          newPosition: createPosition(),
        };
        room = await room.save();
        let socketId1 = room.players[0].socketID;
        let socketId2 = room.players[1].socketID;
        let playerId1 = room.players[0].playerId;
        let playerId2 = room.players[1].playerId;
        let playerColour1 = room.players[0].colour;
        let playerColour2 = room.players[1].colour;
        io.to(socketId1).emit("receive_boardData", {
          playerId: playerId1,
          playerColour: playerColour1,
          data: data1,
        });
        let data2 = data1.newPosition.reverse();
        io.to(socketId2).emit("receive_boardData", {
          playerId: playerId2,
          playerColour: playerColour2,
          data: { newPosition: data2 },
        });

        // room = await room.save()
        io.to(roomId).emit("nextPlayerTurn", {
          playerId: room.nextplayer,
          playerColour: room.nextPlayerColor,
        });
      } else {
        room.nextplayer = room.turnBackPlayer;
        room.nextPlayerColor = room.turnBackPlayerColor;
        // console.log(room.nextPlayerColor, "jjjjjjjj");
        room.allBoardData = room.allBoardData.slice(
          0,
          room.allBoardData.length - 1
        );
        let data1 = room.allBoardData[room.allBoardData.length - 1];
        // console.log(data1, "lallalalallalal");
        room.moveList = room.moveList.slice(0, room.moveList.length - 1);
        room = await room.save();
        let socketId1 = room.players[0].socketID;
        let socketId2 = room.players[1].socketID;
        let playerId1 = room.players[0].playerId;
        let playerId2 = room.players[1].playerId;
        let playerColour1 = room.players[0].colour;
        let playerColour2 = room.players[1].colour;
        io.to(socketId1).emit("receive_boardData", {
          playerId: playerId1,
          playerColour: playerColour1,
          data: data1,
        });
        let data2 = data1.newPosition.reverse();
        io.to(socketId2).emit("receive_boardData", {
          playerId: playerId2,
          playerColour: playerColour2,
          data: { newPosition: data2 },
        });

        room = await Room.findById(roomId);
        io.to(roomId).emit("nextPlayerTurn", {
          playerId: room.nextplayer,
          playerColour: room.nextPlayerColor,
        });
        // console.log("bababababbaab", room.nextplayer, room.nextPlayerColor);
        // room = await room.save()
      }
      io.to(roomId).emit("moveList", room.moveList);
      // io.to(roomId).emit("nextPlayerTurn", { playerId: room.turnBackPlayer, playerColour: room.turnBackPlayerColor })
      // io.to(roomId).emit("allBoardData", room.allBoardData);
      const storeRoomData = await Room.findById(roomId);
      io.to(roomId).emit("allBoardData", storeRoomData);
      room = await Room.findById(roomId);
      // console.log(room.moveList, "fffffffffffffffffffff");
      // Function to find all indices of a specific value in an array
      function checkOddPositions(array) {
        for (let i = 1; i < array.length; i++) {
          // Check if the index is odd (1-based odd positions)
          if (i % 2 === 0 && (array[i] === "O-O" || array[i] === "O-O-O")) {
            return true;
          }
        }
        return false;
      }

      function checkevenPositions(array) {
        for (let i = 1; i < array.length; i++) {
          // Check if the index is odd (1-based odd positions)
          if (i % 2 != 0 && (array[i] === "O-O" || array[i] === "O-O-O")) {
            return true;
          }
        }
        return false;
      }

      // Example usage of the function to find occurrences of "O-O"
      const oddPositionStatus = checkOddPositions(room.moveList);
      const evenPositionStatus = checkevenPositions(room.moveList);
      // console.log(
      //   oddPositionStatus,
      //   evenPositionStatus,
      //   "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
      // );

      if (evenPositionStatus === false) {
        io.to(roomId).emit("castlingStatus", {
          status: "both",
          playerId: room.players[1].playerId,
          playerColour: "b",
        });
      }

      if (oddPositionStatus === true || evenPositionStatus === true) {
        if (oddPositionStatus === true) {
          io.to(roomId).emit("castlingStatus", {
            status: "none",
            playerId: room.players[0].playerId,
            playerColour: "w",
          });
        }

        if (evenPositionStatus === true) {
          io.to(roomId).emit("castlingStatus", {
            status: "none",
            playerId: room.players[1].playerId,
            playerColour: "b",
          });
        }
      } else {
        function whiteRight(array) {
          // Define the valid strings to check for
          const validMoves = ["Ri1", "Rh1", "Rg1"];
          // Check if any of the valid moves are present in the array
          return array.some((item) => validMoves.includes(item));
        }

        function whiteLeft(array) {
          // Define the valid strings to check for
          const validMoves = ["Rb1", "Rc1", "Rd1", "Re1"];
          // Check if any of the valid moves are present in the array
          return array.some((item) => validMoves.includes(item));
        }

        const whiteLeftStatus = whiteRight(room.moveList);
        const whiteRightStatus = whiteLeft(room.moveList);

        if (whiteLeftStatus == true) {
          io.to(roomId).emit("castlingStatus", {
            status: "left",
            playerId: room.players[0].playerId,
            playerColour: "w",
          });
        }
        if (whiteRightStatus == true) {
          io.to(roomId).emit("castlingStatus", {
            status: "right",
            playerId: room.players[0].playerId,
            playerColour: "w",
          });
        }

        if (whiteLeftStatus == false && whiteRightStatus == false) {
          io.to(roomId).emit("castlingStatus", {
            status: "both",
            playerId: room.players[0].playerId,
            playerColour: "w",
          });
        }
        if (whiteLeftStatus == false && whiteRightStatus == true) {
          io.to(roomId).emit("castlingStatus", {
            status: "right",
            playerId: room.players[0].playerId,
            playerColour: "w",
          });
        }
        if (whiteLeftStatus == true && whiteRightStatus == false) {
          io.to(roomId).emit("castlingStatus", {
            status: "left",
            playerId: room.players[0].playerId,
            playerColour: "w",
          });
        }

        function blackLeft(array) {
          // Define the valid strings to check for black left moves
          const validMoves = ["Rc10", "Rb10", "Rd10", "Re10"];
          // Check if any of the valid moves are present in the array
          return array.some((item) => validMoves.includes(item));
        }

        function blackRight(array) {
          // Define the valid strings to check for black right moves
          const validMoves = ["Ri10", "Rh10", "Rg10"];
          // Check if any of the valid moves are present in the array
          return array.some((item) => validMoves.includes(item));
        }

        const blackLeftStatus = blackLeft(room.moveList); // Output: true
        const blackRightStatus = blackRight(room.moveList);

        // console.log(
        //   blackLeftStatus,
        //   blackRightStatus,
        //   "tttttttttttttttttttttttttttt"
        // );

        if (blackLeftStatus == true) {
          io.to(roomId).emit("castlingStatus", {
            status: "right",
            playerId: room.players[1].playerId,
            playerColour: "b",
          });
        }
        if (blackRightStatus == true) {
          io.to(roomId).emit("castlingStatus", {
            status: "left",
            playerId: room.players[1].playerId,
            playerColour: "b",
          });
        }

        if (blackLeftStatus == false && blackRightStatus == false) {
          io.to(roomId).emit("castlingStatus", {
            status: "both",
            playerId: room.players[1].playerId,
            playerColour: "b",
          });
        }
        if (blackRightStatus == false && blackLeftStatus == true) {
          io.to(roomId).emit("castlingStatus", {
            status: "right",
            playerId: room.players[1].playerId,
            playerColour: "b",
          });
        }
        if (blackRightStatus == true && blackLeftStatus == false) {
          io.to(roomId).emit("castlingStatus", {
            status: "left",
            playerId: room.players[1].playerId,
            playerColour: "b",
          });
        }
      }
    } else {
      // console.log("++++++++++++++else mai ghus gayaaa++++++++++++");
      io.to(roomId).emit("turnBackStatus", { turnBackStatus: false });
      io.to(roomId).emit("nextPlayerTurn", {
        playerId: room.nextplayer,
        playerColour: room.nextPlayerColor,
      });
    }
  });

  socket.on("fiveFoldDraw", async (body) => {
    let roundId = body.roundId;
    let roomId = body.roomId;
    let gameType = body.gameType;
    let userId = body.userId;
    //  console.log(gameType,roomId,"gameType")
    if (gameType === "tournament") {
      //  console.log(roundId,"7777777777777777777777777777777777777777777777777777777")

      const match = await Match.findOne({
        round: roundId, // Match the round ID
        $or: [
          { user1: userId }, // Check if userId matches user1
          { user2: userId }, // Check if userId matches user2
        ],
      });

      if (match) {
        // Update match fields
        match.result = "completed";
        match.gameTypeWin = "Draw";
        let room = await Room.findById(roomId);
        room.DrawStatus = true;
        room = await room.save();

        // Save the updated match data
        await match.save();

        //  console.log(match, "Updated Match Data");
      } else {
        console.error("Match not found for the given roundId");
      }

      //  console.log(match,"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    } else {
      //  console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
      let room = await Room.findById(roomId);
      room.DrawStatus = true;
      room = await room.save();
    }
    deleteRoom(roomId);
  });

  socket.on("castling", async (body) => {
    const roomId = body.roomId;
    const playerId = body.playerId;
    const playerColour = body.playerColour;
    const castlingDirection = body.castlingDirection;
    let room = await Room.findById(roomId);
    // console.log(roomId, playerId, playerColour, "jiiiiii");
    // if (playerId == room.players[0].playerId) {
    //   if (castlingDirection == "right") {
    //     room.players[0].castlingRight = "done";
    //   }
    //   if (castlingDirection == "left") {
    //     room.players[0].castlingLeft = "done";
    //   }
    //   if (castlingDirection == "both") {
    //     room.players[0].castlingLeft = "notDone";
    //     room.players[0].castlingRight = "notDone";
    //   }
    //   if (castlingDirection == "none") {
    //     room.players[0].castlingLeft = "Done";
    //     room.players[0].castlingRight = "Done";
    //   }
    // }

    // if (playerId == room.players[1].playerId) {
    //   if (castlingDirection == "right") {
    //     room.players[1].castlingRight = "done";
    //   }
    //   if (castlingDirection == "left") {
    //     room.players[1].castlingLeft = "done";
    //   }

    //   if (castlingDirection == "both") {
    //     room.players[1].castlingLeft = "notDone";
    //     room.players[1].castlingRight = "notDone";
    //   }
    //   if (castlingDirection == "none") {
    //     room.players[1].castlingLeft = "Done";
    //     room.players[1].castlingRight = "Done";
    //   }
    // }

    room = await room.save();

    io.to(roomId).emit("castlingStatus", {
      status: castlingDirection,
      playerId: playerId,
      playerColour: playerColour,
    });
  });
});
app.get("/flag/:countryName", async (req, res) => {
  const countryName = req.params.countryName;
  // console.log(countryName);
  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    // console.log(response.data[0].flags.svg, "vvvv");
    if (response.data && response.data.length > 0) {
      const countryData = response.data[0].flags.svg;
      res.send(`<img src="${countryData}" alt="Flag of ${countryName}" />`); // Returns the URL of the SVG flag
    } else {
      throw new Error("Country not found");
    }
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
});

app.post("/userDeleteNoLoggedIn", async (req, res) => {
  try {
    const { email, name, description } = req.body;

    // Create a new delete user request instance
    const newDeleteUser = new deleteUserRequest({
      email,
      name,
      description,
    });

    // Save the instance to the database
    await newDeleteUser.save();

    return res.status(200).json({
      success: true,
      message: "User delete request saved successfully",
      data: newDeleteUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

app.get("/lookup", async(req, res) => {
    try {
      const data=await PlayersTournament.aggregate([
        {
          $looukup:{
            from:"tournamentdatas",
            localField:"_id",
            foreignField:"tournamentId",
            as:"tournamentData"
          }
        }
      ])
      res.status(200).json({
        success:true,
        data:data
      })
    } catch (error) {
      console.error("Error in lookup method:", error);
      res.status(500).json({ message: "Server error", error });
      
    }
})



//   server connection
server.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});
//   databse connection
mongoose
  .connect(DB_URL, {})
  .then(() => {
    console.log("DB connected...");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

  // your connection code...
mongoose.set('debug', true); // logs every query

mongoose.connection.once('open', () => {
  console.log("✅ Connected to MongoDB DB:", mongoose.connection.name); // should print 'backendDb'
});
