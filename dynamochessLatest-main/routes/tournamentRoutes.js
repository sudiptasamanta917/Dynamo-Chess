
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport"); 
const {
    createTournament,getMyTournament,deleteTournament,updateTournament,joinTournament,getTournamentByUserId,startTournament,getboardNumberData,
    getTournamentById,adminNotification,getUpcomingTournament,getpairPlayers,getOngoingmatch,getOngoingmatchData,getTournamentResult,getOngoingMatchDatas,getCompletedmatch,getPairedList,getJoinedCount,getDataByRoundIdAndNumber,userScoreDataForAdmin,getTime,
    getAllTournament,searchTournament,redirectUrl

} = require("../controllers/tournament/tournamentController");

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

const tournamentRoute = express.Router();

tournamentRoute.use(bodyParser.urlencoded({ extended: true }));
tournamentRoute.use(bodyParser.json());
tournamentRoute.use(express.static("public"));
// const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/trainerImages"),
      function (error, sucess) {
        if (error) throw error;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error1, sucess1) {
      if (error1) throw error1;
    });
  },
});
const upload = multer({ storage: storage });
tournamentRoute.get('/', (req, res) => {
  res.send('Products API running. New deploy.');
});
tournamentRoute.get('/ping', (req, res) => {
  res.send('PONG');
});

 //register admin
tournamentRoute.post(
  "/createTournament",
  user_auth,
  // checkRole(["admin"]),
  (req, res) => createTournament(req ,res)
);

tournamentRoute.get("/getMyTournament", (req, res) => getMyTournament(req, res));
tournamentRoute.get("/searchTournament", (req, res) => searchTournament(req, res));
tournamentRoute.get("/getAllTournament", (req, res) => getAllTournament(req, res));
tournamentRoute.post("/deleteTournament/:tournamentId",(req,res)=>deleteTournament(req,res))
tournamentRoute.post("/updateTournament/:tournamentId",(req,res)=>updateTournament(req,res))
tournamentRoute.post("/joinTournament/:tournamentId", user_auth,(req,res)=>joinTournament(req,res))
tournamentRoute.get("/getMyTournamentByuserId", user_auth,(req,res)=>getTournamentByUserId(req,res))
tournamentRoute.get("/getMyTournamentById/:id", user_auth, getTournamentById);
tournamentRoute.get("/todayTournament", user_auth,checkRole(["admin"]),adminNotification);
// tournamentRoute.get("/startTournament/:tournamentId/:gameTime/:roundNumber/:noOfRounds/:delayTime", user_auth,checkRole(["admin"]),startTournament);
tournamentRoute.get("/getTournamentResult/:tournamentId", user_auth,getTournamentResult);
tournamentRoute.get("/getUpcomingTournament", user_auth,(req,res)=>getUpcomingTournament(req,res));

tournamentRoute.get("/getpairPlayers/:id", user_auth,(req,res)=>getpairPlayers(req,res));
tournamentRoute.get("/getOngoingmatch", user_auth,(req,res)=>getOngoingmatch(req,res));
tournamentRoute.get("/getCompletedmatch", user_auth,(req,res)=>getCompletedmatch(req,res));
tournamentRoute.get("/getOngoingmatchData/:id", user_auth,(req,res)=>getOngoingmatchData(req,res));
tournamentRoute.get("/getOngoingMatchDatas/:tournamentId", user_auth,(req,res)=>getOngoingMatchDatas(req,res));
tournamentRoute.get("/getPairedList/:tournamentId", user_auth,(req,res)=>getPairedList(req,res));
tournamentRoute.get("/getJoinedCount/:tournamentId/:roundId/:userId",user_auth, (req,res)=>getJoinedCount(req,res));
tournamentRoute.get("/getDataByRoundIdAndNumber/:tournamentId/:roundNumber", (req,res)=>getDataByRoundIdAndNumber(req,res));
tournamentRoute.get("/getboardNumberData/:tournamentId", (req,res)=>getboardNumberData(req,res));
tournamentRoute.get("/userScoreDataForAdmin/:tournamentId", (req,res)=>userScoreDataForAdmin(req,res));
tournamentRoute.get("/getCurrentTime", (req,res)=>getTime(req,res));
tournamentRoute.get("/redirectUrl/:roundId/:userId", (req,res)=>redirectUrl(req,res))


module.exports = tournamentRoute;
