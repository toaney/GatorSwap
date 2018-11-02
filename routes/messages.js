var express = require("express");
var router  = express.Router({mergeParams: true});
var Listing = require("../models/listing");
var Message = require("../models/message");
var middleware = require("../middleware");
var Category = require("../models/category");

//Messages New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find listing by id
    console.log(req.params.id);
    Listing.findById(req.params.id, function(err, listing){
        if(err){
            console.log(err);
        } else {
            Category.find({}, function(err, allCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("messages/new", {listing: listing,categories:allCategories});
                }
            });
            //  res.render("messages/new", {listing: listing});
        }
    })
});

//Messages Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup listing using ID
   Listing.findById(req.params.id, function(err, listing){
       if(err){
           console.log(err);
           res.redirect("/listings");
       } else {
        Message.create(req.body.message, function(err, message){
           if(err){
               console.log(err);
           } else {
               //add username and id to message
               message.author.id = req.user._id;
               message.author.username = req.user.username;
               //save message
               message.save();
               listing.messages.push(message);
               listing.save();
               console.log(message);
               req.flash('success', 'message sent');
               res.redirect('/listings/' + listing._id);
           }
        });
       }
   });
});

router.get("/:messageId/edit", middleware.isLoggedIn, function(req, res){
    // find listing by id
    Message.findById(req.params.messageId, function(err, message){
        if(err){
            console.log(err);
        } else {
            Category.find({}, function(err, allCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("messages/new", {listing_id: req.params.id, message: message,categories:allCategories});
                }
            });
            //  res.render("messages/edit", {listing_id: req.params.id, message: message});
        }
    })
});

router.put("/:messageId", function(req, res){
   Message.findByIdAndUpdate(req.params.messageId, req.body.message, function(err, message){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/listings/" + req.params.id);
       }
   }); 
});

router.delete("/:messageId",middleware.checkUserMessage, function(req, res){
    Message.findByIdAndRemove(req.params.messageId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/listings/" + req.params.id);
        }
    })
});

module.exports = router;