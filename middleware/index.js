var Message = require("../models/message");
var Listing = require("../models/listing");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserListing: function(req, res, next){
        if(req.isAuthenticated()){
            Listing.findById(req.params.id, function(err, listing){
               if(listing.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   console.log("BADD!!!");
                   res.redirect("/listings/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    checkUserMessage: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Message.findById(req.params.messageId, function(err, message){
               if(message.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/listings/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    }
}