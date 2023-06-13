//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
//!require bcrypt
const bcrypt = require("bcrypt");
app.use(express.static("public"));
app.set("view engine", "ejs");
const saltRounds = 10;
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

// create model
const User = mongoose.model("User", userSchema);

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

app.post("/register", (req, res) => {
  //! step:2  add this funcion
  //! step:3 add  register funcion to inside a bcrypt funcion
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      // ADD MD5 TO PASSWORD
      password: hash,
    });
    newUser
      .save()
      .then((docs) => {
        // Handle the result here
        res.render("secrets");
      })
      .catch((error) => {
        // Handle any errors that occurred
        console.error(error);
      });
  });
});
app.post("/login", (req, res) => {
  //add md5 to password

  const password = req.body.password;
  const email = req.body.username;
  User.findOne({ email: email })
    .then((user) => {
      //!step4  : add compare funcion and replace hash with suer password
      if (user) {
        bcrypt.compare(password, user.password, function (err, result) {
          //!step 5: check if password match and send website
          if (result === true) {
            res.render("secrets");
          }
        });
      } else {
        res.send("Invalid login or password"); // or redirect to a login error page
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("An error occurred"); // or redirect to an error page
    });
});

app.listen(3000, function () {
  console.log("server is connected");
});
