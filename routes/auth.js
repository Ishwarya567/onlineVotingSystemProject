const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/Expresserror.js");
const passport=require("passport");
const{saveRedirectUrl}=require("../middleware/auth.js");
const {validateUser}=require("../middleware/validate.js")
const authController=require("../controllers/authController.js")


//loginForm and login
router.route("/login")
.get((authController.getLoginForm))
.post(saveRedirectUrl,
  passport.authenticate('local', 
  { failureRedirect: '/auth/login',
  failureFlash:true
}),authController.login);

//SignupForm and register
router.route("/register")
.get((authController.getsignupform))
.post(validateUser,wrapAsync(authController.register));

//logout

router.route("/logout")
.get((req,res)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","Logged you out!");
      res.redirect("/");
    })
  });
module.exports=router;