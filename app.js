var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Listing     = require("./models/listing"),
    Message     = require("./models/message"),
    User        = require("./models/user"),
    Category    = require("./models/category"),
    session     = require("express-session"),
    methodOverride = require("method-override");
    
var serverPort = 3000; //nginx on AWS set to forward / to port 3000

    
//requiring routes
var messageRoutes    = require("./routes/messages"),
    listingRoutes = require("./routes/listings"),
    indexRoutes      = require("./routes/index")

//This could throw an exception
mongoose.connect("mongodb://team06:team06@ds131313.mlab.com:31313/gatorswapdb", {useMongoClient: true});
//mongoose.connect("mongodb://teamsix:team06@ds131313.mlab.com:31313/gatorswapdb");

app.use(bodyParser.urlencoded({extended: true}));//for forms
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));


// PASSPORT CONFIGURATION
//HTTP is stateless; in order to associate a request to any other request, 
//sessions is a way to store user data between HTTP requests.
app.use(require("express-session")({
    secret: "Three may keep a secret, if two of them are dead.",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/messages", messageRoutes);

// app.listen(process.env.PORT, process.env.IP, function(){
//   console.log("The YelpCamp Server Has Started!");
// });

// Category.create({category: "electronics",}, function(err, category){
//     if(err){
//         console.log(err);
//     } else {
//         category.save();
//         console.log("Created new category");
//     }
// });

if (process.env.PORT != null) {
  app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The GatorSwap application server has started on Heroku");
    console.log(process.env.PORT);
  });
} else {
  app.listen(serverPort, function(){
    console.log("The GatorSwap application server has started on port " + serverPort);
  });
}