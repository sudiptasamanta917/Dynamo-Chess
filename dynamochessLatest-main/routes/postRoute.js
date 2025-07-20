const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const {
    createPost,
    getPost,
    deletePost,
    updatePost,
    getAllPost,
    getPostByLatLong,
    getActiveUser,
    getInActiveUser
} = require("../controllers/Post/postController");
const {
  registerValidator,
  loginValidator,
  updatePassword,
  updateProfile,
  resetPassword,
  forgetPassword,
} = require("../helpers/index");
const auth = require("../middleware/auth");
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
const postRoute = express.Router();

postRoute.use(bodyParser.urlencoded({ extended: true }));
postRoute.use(bodyParser.json());
postRoute.use(express.static("public"));

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
postRoute.get('/ping', (req, res) => {
  res.send('PONG');
});


 //register admin
postRoute.post(
  "/createPost",
  user_auth,
  (req, res) => createPost(req,res)
);

postRoute.get(
  "/getPost/:postId",
  user_auth,
  (req, res) => getPost(req,res)
)

postRoute.post(
  "/deletePost/:postId",
  user_auth,
  (req, res) => deletePost(req,res)

)

postRoute.post(
  "/updatePost/:postId",
  user_auth,
  (req, res) => updatePost(req,res)
)

postRoute.get(
    "/getAllPost",
    user_auth,
    (req, res) => getAllPost(req,res)
)

postRoute.get(
    "/getPostByLatLong",
    user_auth,
    (req, res) => getPostByLatLong(req,res)
)

postRoute.get(
    "/getActiveUser",
    user_auth,
    (req, res) => getActiveUser(req,res)
)

postRoute.get(
    "/getInActiveUser",
    user_auth,
    (req, res) => getInActiveUser(req,res)
)
module.exports = postRoute;
