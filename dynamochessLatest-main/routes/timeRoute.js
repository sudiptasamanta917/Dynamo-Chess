const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const {
  getTime,
  setTime
} = require("../controllers/Time/TimeController");

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

const timeRoute = express.Router();

timeRoute.use(bodyParser.urlencoded({ extended: true }));
timeRoute.use(bodyParser.json());
timeRoute.use(express.static("public"));

// const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
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




timeRoute.get('/ping', (req, res) => {
  res.send('PONG');
});

// getTime route 
timeRoute.get("/getTime",(req, res) => getTime(req,"user", res));

 //setTime by admin
 timeRoute.post(
  "/setTime",
  (req, res) => setTime(req,"admin" ,res)
);

module.exports = timeRoute;
