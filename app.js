//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


const app = express();





mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


const userSchema = new mongoose.Schema({
  email: String,
  password : String
});



const User = mongoose.model("User", userSchema);

// home

app.get("/", function(req,res){
  res.render("home");
});



// register

app.get("/register", function(req,res){
  res.render("register");
});


app.post("/register", function(req,res){
  const newUser = new User(
    {
      email: req.body.username,
      password:md5(req.body.password)
    }
  );
  newUser.save();
  res.render("secrets");
});


// login
app.get("/login", function(req,res){
  res.render("login");
});

app.post("/login", function(req,res){

User.findOne({email: req.body.username}, function(err,foundUser){
  if(foundUser){
    if(foundUser.password === md5(req.body.password)){
      res.render("secrets");
    } else {
      res.redirect("/login");
    }
  } else {
    res.send(err);
  }
});

});


app.listen(3000, function() {
    console.log("Server started on port 3000.");
});
