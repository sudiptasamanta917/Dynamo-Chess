const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const { createRunningMatch,getMatch,getPostMatchDetails,createWinnerMatchData,getMyResult } = require("../controllers/tournament/MatchController");
const { validationResult } = require('express-validator');  // Ensure this is required

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

const matchRoute = express.Router();

matchRoute.use(bodyParser.urlencoded({ extended: true }));
matchRoute.use(bodyParser.json());
matchRoute.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/bannerImages"), function (error, success) {
      if (error) throw error;
    });
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error1, success1) {
      if (error1) throw error1;
    });
  },
});

const upload = multer({ storage: storage });

matchRoute.get('/ping', (req, res) => {
  res.send('PONG');
});

// getRule route
matchRoute.get("/getMatch",(req, res) => getMatch(req, res));

// setRule with multiple images by admin
matchRoute.post(
  "/createRunningMatch",
  // Adjust the limit as needed
  (req, res) => createRunningMatch(req, res)
);
// deleteRule route
matchRoute.get("/getPostMatchDetails/:id",   (req, res) => getPostMatchDetails(req, res));
matchRoute.get("/getMyResult/:id",   (req, res) => getMyResult(req, res));
matchRoute.post("/createWinnerMatchData",(req,res)=>createWinnerMatchData(req,res))


module.exports = matchRoute;
