//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();





mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true
});



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



const User = mongoose.model("User", userSchema);

// home

app.get("/", function(req, res) {
  res.render("home");
});



// register

app.get("/register", function(req, res) {
  res.render("register");
});


app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save();
    res.render("secrets");

  });

});


// login
app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {

  User.findOne({ email: req.body.username }, function(err, foundUser) {

    if (foundUser) {

      bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
        if (result == true) {
          res.render("secrets");
        }
      });

    } else {
      res.send(err);
    }
  });

});


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
