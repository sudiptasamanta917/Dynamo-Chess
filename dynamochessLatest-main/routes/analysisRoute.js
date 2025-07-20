const express = require("express");
const bodyParser = require("body-parser");

const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
const { getAnalysisByUserId,getAnalysisBoardByRoomId } = require("../controllers/Analysis/AnalysisController");
const AnalysisRoute = express.Router();

AnalysisRoute.use(bodyParser.urlencoded({ extended: true }));
AnalysisRoute.use(bodyParser.json());

// AnalysisRoute.get('/challengeping', (req, res) => {
//   res.send('PONG');
// });


 //register admin
 AnalysisRoute.post(
  "/challenge",
  (req, res) => Createchallenge(req,res)
);
AnalysisRoute.post(
  "/deleteChallenge/:challengeId",
  (req, res) => deleteChallenge(req,res)
)
AnalysisRoute.get(
    "/analysisBoard/:playerId",
    (req, res) => getAnalysisByUserId(req, res)
 );
AnalysisRoute.get(
    "/getAnalysisBoardByRoomId/:roomId",
    (req, res) => getAnalysisBoardByRoomId(req, res)
 );



module.exports = AnalysisRoute;
