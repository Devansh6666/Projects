if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));

main().then((res) => {
    console.log("connect MOngoDB");
}) .catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}



const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET_KEY,
    },
    touchAfter: 24 * 3600,
});

store.on("error" , ()=> {
    console.log("ERROR in Mongo Session Store", err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxage: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};


// Session and Flash 
app.use(session(sessionOption));
app.use(flash());

//Passport use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash message
app.use((req ,res , next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});


//Routes Use
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/listing/search" ,(req ,res) => {
    res.send("done");
});
//Middleware to all request
app.all("/{*splat}", (req , res ,next) => {
    next(new ExpressError(404, "Page not Found"));
    
});

//Error Handling
app.use((err , req ,res , next) => {
    let {statusCode , message} = err;
   res.render("listings/error.ejs",{message});
    //res.status(statusCode).send({message});   
} );


app.listen(8080 ,()=> {
    console.log("server is running on port 8080");
});




