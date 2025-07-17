if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError=require("./utils/ExpressError.js")
const listingsRouter=require("./routes/listing.js");
const User=require("./models/user.js")
const reviewsRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const app = express();
 
app.engine("ejs", ejsMate);
app.use(method_override("_method"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "/public")));


const dbUrl=process.env.MONGO_ATLAS_URL;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("error",()=>{
    console.log("ERROR IN MONGODB SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly : true
    } 
}
app.get("/", (req, res) => {
    res.redirect("/listings");
})

app.use(session(sessionOptions));
app.use(flash());
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Database connection
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DATABASE");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}
//Root Route



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//Index Route--(GET)
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter);




// app.get("/demouser",async(req,res)=>{

//             let user=new User({
//                 email:"deekshithyadav32@gmail.com",
//                 username :"deekshith"
//             })

//             let newUser=await User.register(user,"Bunny123#");
//             res.send(newUser);
// })

// app.get("/addListing",async (req,res)=>{
//     let newlisting=new Listing({
//         title : "Cozy Mountain Cabin",
//         description : "A beautiful and secluded cabin in the mountains, perfect for a getaway.",
//         price: 120,
//         location: "Rocky Mountains",
//         country: "USA"
//     })
//     await newlisting.save();
//     res.send("data inserted successfully");
// })

//404 error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "resource not found"));

})

//Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Internal server error" } = err;
    res.status(statusCode).json({
        success: "false",
        message: message
    })

})


app.listen(8080, () => {
    console.log("server is listening at post 8080");
})