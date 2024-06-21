const User=require("../models/user.js");

module.exports.getsignupform=(req,res)=>{
    res.render("auth/register.ejs")
};

module.exports.register=async(req,res)=>{
    try{const{username,email,password}=req.body;
    const newuser=new User({username,email});
    const registeredUser=await User.register(newuser,password);
    req.login(registeredUser,(err)=>{
    if(err){
      return next(err);
    }
    req.flash("Success","welcome to E-Vote");
    res.redirect("/");
    })
  }catch(e){
    req.flash("error",e.message);
    res.redirect("/auth/register");
  }
  };

module.exports.getLoginForm=(req,res)=>{
    res.render("auth/login.ejs")
};

module.exports.login=async(req, res) =>{
    let redirectUrl=res.locals.redirectUrl||"/";
    req.flash("success","welcome back to E-vote");
    res.redirect(redirectUrl);
   };

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Logged you out!");
      res.redirect("/");
    })
  };
