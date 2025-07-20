const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const { createRating,getRatings,deleteRating } = require("../controllers/Rating/ratingController");
const { validationResult } = require('express-validator');  // Ensure this is required

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

const ratingRoute = express.Router();

ratingRoute.use(bodyParser.urlencoded({ extended: true }));
ratingRoute.use(bodyParser.json());
ratingRoute.use(express.static("public"));

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

ratingRoute.get('/ping', (req, res) => {
  res.send('PONG');
});

// getRule route
ratingRoute.get("/getRatings", (req, res) => getRatings(req, res));

// setRule with multiple images by admin
ratingRoute.post(
  "/createRating",
  user_auth,
//   upload.array("images", 10),  // Adjust the limit as needed
  (req, res) => createRating(req, res)
);

ratingRoute.post(
  "/deleteRating/:id",
  user_auth,
  //   upload.array("images", 10),  // Adjust the limit as needed
  (req, res) => deleteRating(req, res)
)

// ratingRoute.post(
//   "/editRuleContent/:id",
//     // Adjust the limit as needed
//   (req, res) => editRuleContent(req, res)
// )

module.exports = ratingRoute;
