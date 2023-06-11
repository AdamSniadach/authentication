//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
const uri = "mongodb://0.0.0.0:27017/usersDB";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB", error));

// create Schema : rools
const userSchema = new mongoose.Schema({
  emial: String,
  password: String,
});
// create model
const User = mongoose.model("User", userSchema);

// create object to insert to database
// const Adam = new User({
//   name: "Adam",
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
  const newUser = new User({
    emial: req.body.username,
    password: req.body.password,
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
app.post("/login", (req, res) => {
  const password = req.body.password;
  const emial = req.body.username;
  User.findOne({ emial: emial, password: password })
    .then((user) => {
      if (user.password === password && user.emial === emial) {
        res.render("secrets");
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
