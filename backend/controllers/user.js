const User=require("../models/user")

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup=async (req, res) => {
    try{
    let { username, email, password } = req.body;
    const newuser = new User({ username, email });
    const registeredUser=await User.register(newuser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
           
        }
          req.flash("success","Welcome To WanderLust!");
                res.redirect("/listings");
    })
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.login=async (req,res)=>{
        // res.send("Welcome to wanderLust , You are logged in !!");
        req.flash("success","You are logged in Successfull!");
        let redirectUrl=res.locals.redirectUrl||"/listings";
        res.redirect(redirectUrl);;
    }

    module.exports.logout=(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                next(err);
            }
            req.flash("success","logged you out!");
            res.redirect("/listings");
        })
    }