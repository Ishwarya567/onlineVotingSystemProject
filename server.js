if(process.env.NODE_ENV !="production")
  {
require("dotenv").config();
  }
const express = require('express');
const mongoose = require('mongoose');
const path=require("path");
const app = express();
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const ExpressError=require("./utils/Expresserror.js");
const session=require("express-session");
const mongoStore=require("connect-mongo");
const {Election}=require("./models/Election.js");
const flash=require("connect-flash");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const wrapAsync=require("./utils/wrapAsync.js")

const authRouter=require("./routes/auth.js");
const elecRouter=require("./routes/election.js");
const passport = require("passport");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

main()
.then((res)=>{
  console.log("db is connected");
}).catch((err)=>{
console.log(err);
})

async function main(){
  await mongoose.connect(process.env.MONGODB_URI);
};

const store=mongoStore.create({
  mongoUrl:process.env.MONGODB_URI,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
});
store.on("error",()=>{
  console.log("error on mongo session store");
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true
  }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});


app.use("/auth",authRouter);
app.use("/elec",elecRouter);

app.get("/",wrapAsync(async(req,res)=>{
  let elections=await Election.find({});
  res.render("home.ejs",{elections});
  }));

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something Went Wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
})
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

