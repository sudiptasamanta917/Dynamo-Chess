
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport"); 
const {
  CreateTrainer,getTrainer,deleteTrainer,editTrainer,searchUser
} = require("../controllers/Trainer/trainerController");

const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

const trainerRoute = express.Router();

trainerRoute.use(bodyParser.urlencoded({ extended: true }));
trainerRoute.use(bodyParser.json());
trainerRoute.use(express.static("public"));
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
trainerRoute.get('/', (req, res) => {
  res.send('Products API running. New deploy.');
});
trainerRoute.get('/ping', (req, res) => {
  res.send('PONG');
});

 //register admin
trainerRoute.post(
  "/createTrainer",
  upload.single("image"),
  (req, res) => CreateTrainer(req,res)
);
trainerRoute.get("/getTrainer/:trainerId", (req, res) => getTrainer(req, res));
trainerRoute.post("/deleteTrainer/:trainerId",(req,res)=>deleteTrainer(req,res))
trainerRoute.post("/editTrainer/:trainerId", upload.single("image"), (req, res) => editTrainer(req, res));
trainerRoute.get("/searchUser",(req,res)=>searchUser(req,res))



module.exports = trainerRoute;
