const express           = require("express"),
      bodyParser        = require("body-parser"),
      mongoose          = require("mongoose"),
      passport          = require("passport"),
      LocalStrategy     = require("passport-local"),
      methodOverride    = require("method-override"),
      Campground        = require("./models/campground"),
      Comment           = require("./models/comment"),
      User              = require("./models/user"),
      seedDB            = require("./seeds"),
      app               = express(),
      PORT              = 3000;

//Requiring Routes
const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      indexRoutes        = require("./routes/index");

mongoose.connect('mongodb://localhost/abhi_camp_v10',{useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
//seedDB(); //Seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")(
{
    secret:"Once Again Abhishek Nailed It!!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
    res.locals.currentUser=req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(PORT,function(req,res)
{
    console.log("Abhicamp started at PORT 3000");
});