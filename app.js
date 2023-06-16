//jshint esversion:6
//! step 1: npm i passport passport-local passport-local-mongoose express-session;
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
//! step: 2 require session, passport and passport local mongoose
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//! step3: add app.use in top of file belowe require

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
const uri = "mongodb://0.0.0.0:27017/usersDB";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

// create Schema : rools
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});
//! step4 : add plugin to schema
userSchema.plugin(passportLocalMongoose);
// create model
const User = mongoose.model("User", userSchema);
//!step5 : add this from passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// const Adam = new User({
//   password: "Adam",
//   email: "snn@o2.pl",
// });

// Adam.save();

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
//!step7 : set up secrets
app.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
//!step9: add log out
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    var params = {
      client_id: process.env["AUTH0_CLIENT_ID"],
      returnTo: "http://localhost:3000/",
    };
    res.redirect("/login");
  });
});

//!step6 : set up register
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );
});
//!step8: login in
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3000, function () {
  console.log("server is connected");
});
