var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Listing = require("../models/listing");
var Category = require("../models/category");

//root route
router.get("/", function(req, res){
    Category.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            res.render("landing",{categories:allCategories}); 
        }
        
    });
    // res.render("landing");
});

// show register form
router.get("/register", function(req, res){
    Category.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            res.render("register",{categories:allCategories}); 
        }
        
    });
//   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Hello " + req.body.username);
           res.redirect("/listings"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   Category.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            res.render("login",{categories:allCategories}); 
        }
        
    });
//   res.render("login"); 
});

//handling login logic
//middleware: code that runs before the callback function
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/listings",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();//passport destroys all user data in the session
   req.flash("success", "You've logged out.");
   res.redirect("/listings");
});


module.exports = router;