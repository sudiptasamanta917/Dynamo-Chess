const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const { getRuleContent, createRuleContent,deleteRuleContent,editRuleContent, getRuleContentMultipleTitle,scrollingText,getScrollText } = require("../controllers/Content/ruleController");
const { validationResult } = require('express-validator');  // Ensure this is required

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

const ruleRoute = express.Router();

ruleRoute.use(bodyParser.urlencoded({ extended: true }));
ruleRoute.use(bodyParser.json());
ruleRoute.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/rulesImages"), function (error, success) {
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

ruleRoute.get('/ping', (req, res) => {
  res.send('PONG');
});

// getRule route
ruleRoute.get("/getRule/:title", (req, res) => getRuleContent(req, res));
ruleRoute.get("/getScrollText/:title", (req, res) => getScrollText(req, res));
ruleRoute.post("/getMultipleRule/", (req, res) => getRuleContentMultipleTitle(req, res));

// setRule with multiple images by admin
ruleRoute.post(
  "/setRule",
  upload.array("images", 10),  // Adjust the limit as needed
  (req, res) => createRuleContent(req,"admin", res)
);

ruleRoute.post(
  "/deleteRule/:id",
  (req, res) => deleteRuleContent(req,"admin", res)
)

ruleRoute.post(
  "/editRuleContent/:id",
    // Adjust the limit as needed
  (req, res) => editRuleContent(req, res)
)
ruleRoute.post("/scrollText",(req,res)=>scrollingText(req,res))

module.exports = ruleRoute;
