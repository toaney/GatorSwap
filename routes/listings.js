var express = require("express");
var router  = express.Router();
var Listing = require("../models/listing");
var Category = require("../models/category");
var middleware = require("../middleware");
var request = require("request");

var multer = require('multer');//for image upload
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) { //extension check (jpg... not pdf...)
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('jpg, jpeg, png, or gif format only'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dzjtqbbua', 
  api_key: '559561864892248', 
  api_secret: 'n1jUnMK_r3B3hGuVIHasS7kHj1Y'
});

//INDEX - show all listings with fuzzy search
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search || req.query.searchcategory) {// non empty search
        const regex = new RegExp(escapeRegex(req.query.searchcategory), 'gi');
        const regexcategory = new RegExp(escapeRegex(req.query.searchcategory), 'gi');

        Listing.find({$or:[ {name: regex}, {description: regex}, {category: regex},{category: regexcategory}]}, function(err, allListings){
           if(err){
               console.log(err);
           } else {
              if(allListings.length < 1) {
                  noMatch = "No matching result, please try again.";
              }
              Category.find({}, function(err, allCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("listings/index", {listings:allListings, noMatch: noMatch,categories:allCategories}); 
                }
              });
            //   res.render("listings/index",{listings:allListings, noMatch: noMatch});
           }
        });
    } else {
        // Get all listings from DB if search string empty
        Listing.find({}, function(err, allListings){
           if(err){
               console.log(err);
           } else {
               Category.find({}, function(err, allCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("listings/index", {listings:allListings, noMatch: noMatch,categories:allCategories}); 
                }
               });
            //   res.render("listings/index",{listings:allListings, noMatch: noMatch});
           }
        });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//CREATE - add new listing to DB with uploading image function
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
    // get data from form and add to listings array
    cloudinary.uploader.upload(req.file.path, function(result) {
    // add cloudinary url for the image to the listing object under image property
    req.body.listing.image = result.secure_url;// see cloudinary npm doc
    // add author to listing
    req.body.listing.author = {
        id: req.user._id,
        username: req.user.username,
    }
    Listing.create(req.body.listing, function(err, listing) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/listings/' + listing.id);
        });
    });
});

//NEW - show form to create new listing
router.get("/new", middleware.isLoggedIn, function(req, res){
    Category.find({}, function(err, allCategories){
        if(err){
            console.log(err);
        } else {
            res.render("listings/new",{categories:allCategories}); 
        }
        
    });
   //res.render("listings/new"); 
});

// SHOW - shows more info about one listing
router.get("/:id", function(req, res){
    //find the listing with provided ID
    Listing.findById(req.params.id).populate("messages").exec(function(err, foundListing){
        if(err){
            console.log(err);
        } else {
            console.log(foundListing)
            //render show template with that listing
            Category.find({}, function(err, allCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("listings/show", {listing: foundListing,categories:allCategories}); 
                }
            });
            // res.render("listings/show", {listing: foundListing});
        }
    });
});

router.get("/:id/edit", middleware.checkUserListing, function(req, res){
    console.log("IN EDIT!");
    //find the listing with provided ID
    Listing.findById(req.params.id, function(err, foundListing){
        if(err){
            console.log(err);
        } else {
            //render show template with that listing
            Category.find({}, function(err, allCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("listings/edit", {listing: foundListing,categories:allCategories}); 
                }
            });
            // res.render("listings/edit", {listing: foundListing});
        }
    });
});

router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Listing.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, listing){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","your listing is updated");
            res.redirect("/listings/" + listing._id);
        }
    });
});


//middleware refactored
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You must be signed in to do that!");
//     res.redirect("/login");
// }

module.exports = router;

