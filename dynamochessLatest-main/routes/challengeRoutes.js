const express = require("express");
const bodyParser = require("body-parser");

const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
const { Createchallenge,deleteChallenge,notification,pairedPlayer } = require("../controllers/Challenge/challengeControllers");
const challengeRoute = express.Router();

challengeRoute.use(bodyParser.urlencoded({ extended: true }));
challengeRoute.use(bodyParser.json());

challengeRoute.get('/challengeping', (req, res) => {
  res.send('PONG');
});


 //register admin
 challengeRoute.post(
  "/challenge",
  (req, res) => Createchallenge(req,res)
);
challengeRoute.post(
  "/deleteChallenge/:challengeId",
  (req, res) => deleteChallenge(req,res)
)

challengeRoute.get(
  "/notification/:userId",
  (req, res) => notification(req,res)
)
challengeRoute.get(
  "/pairedPlayer/:userId",
  (req, res) => pairedPlayer(req,res)
)

module.exports = challengeRoute;
