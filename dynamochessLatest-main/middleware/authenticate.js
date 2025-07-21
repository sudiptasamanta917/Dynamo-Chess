var passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => {
  done(null, user); // Store the entire user object
});
passport.deserializeUser((user, done) => {
  done(null, user); // Retrieve the entire user object
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://${VITE_URL}/callback",
            scope: ["profile", "email"],
        },
        function (accessToken, refreshToken, profile, callback) {
            callback(null, profile);
        }
    )
);  