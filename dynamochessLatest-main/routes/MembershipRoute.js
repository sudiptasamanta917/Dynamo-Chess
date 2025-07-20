const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
// const { validationResult } = require('express-validator');  // Ensure this is required

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
const { createMembership, getMembership } = require("../controllers/Membership/MembershipController");

const membershipRoute = express.Router();

membershipRoute.use(bodyParser.urlencoded({ extended: true }));
membershipRoute.use(bodyParser.json());
membershipRoute.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/membershipImages"), function (error, success) {
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

membershipRoute.get('/membership', (req, res) => {
  res.send('PONG');
});

// getRule route
membershipRoute.get("/getMembership", (req, res) => getMembership(req, res));

// setRule with multiple images by admin
membershipRoute.post(
    "/setMembership",
    upload.array("membershipimg", 10),  // Adjust the limit as needed
    createMembership
);

// membershipRoute.post(
//   "/deleteRule/:id",
//   (req, res) => deleteRuleContent(req,"admin", res)
// )

// membershipRoute.post(
//   "/editRuleContent/:id",
//     // Adjust the limit as needed
//   (req, res) => editRuleContent(req, res)
// )

module.exports = membershipRoute;