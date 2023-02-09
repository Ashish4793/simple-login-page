require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
 

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


mongoose.set("strictQuery" ,false);

mongoose.connect(process.env.MONGO_URI,function(err){
    if(err){
        console.log(err);
    } else {
        console.log("Connection to Database Estabhlished!!!");
    }
});



const userSchema = new mongoose.Schema({
    username : {type :String, unique : true},
    email : {type :String, unique : true},
    password : String
});

const User = mongoose.model("User" , userSchema);

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.get("/", function(req,res){
    res.render("home");
});

app.post("/register", function(req,res){
    const user = new User ({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    });

    user.save(function(err){
        if(err){
            res.render("error");
        } else {
            res.render("success");
        }
    });
});

app.post("/login", function(req,res){
    User.findOne({username : req.body.username}, function(err,foundUser){
        if(foundUser){
            if (foundUser.password === req.body.password){
                res.render("success");
            } else{
                res.render("error2");
            }
        } else {
            res.render("error3");
        }
    })
});


app.listen(3000, function(){
    console.log("<<<<-----Server Started on port 3000----->>>>");
});