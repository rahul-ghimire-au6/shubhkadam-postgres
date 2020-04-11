const { get, post, put, delete1 } = require("../controllers/userController")
const { Router } = require("express")
const router = Router()
const { check } = require("express-validator")
const passport=require('passport')
//require google strategy
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
//require facebook strategy
const { Strategy: FacebookStrategy } = require("passport-facebook");
const users=require('../models/usermodel')

router.use(passport.initialize())
passport.serializeUser((user,done)=>{
    console.log(user)
    done(null,user.id)
})
//google middleware
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://shubh-kadam-psql.herokuapp.com/google/redirect`
  },
  (accessToken, refreshToken, profile,done)=>{
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    //checking if user already exits or not
    users.findOne({where:{googleid:profile.id}}).then(currentuser=>{
        if(currentuser){ 
            done(null,currentuser)
        }else{
            let token = async ()=>{
                SECRET_KEY = `${profile.displayName}-${new Date(users.createdAt).getTime()}`
                const token1 = await sign({ id: profile.id }, SECRET_KEY, {
                    expiresIn: "1d"
                })
                new users({
                    name:profile.displayName,
                    googleid:profile.id,
                    token:await token1,
                    email:accessToken,
                    password:'null',
                    phoneNo:accessToken,
                    resetToken:accessToken,
                    verified_email:true,
                    isthirdparty:true,
                }).save().then((currentuser)=>{
                done(null,currentuser)
                })
            }
            token()
        }
    })
  }
));
//facebook middleware
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_API,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `http://shubh-kadam-psql.herokuapp.com/facebook/redirect`
  },
  (accessToken, refreshToken, profile,done)=>{
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    //checking if user already exits or not
    users.findOne({where:{facebookid:profile.id}}).then(currentuser=>{
        if(currentuser){ 
            done(null,currentuser)
        }else{
            let token = async ()=>{
                SECRET_KEY = `${profile.displayName}-${new Date(users.createdAt).getTime()}`
                const token1 = await sign({ id: profile.id }, SECRET_KEY, {
                    expiresIn: "1d"
                })
                new users({
                    name:profile.displayName,
                    facebookid:profile.id,
                    token:await token1,
                    email:accessToken,
                    password:'null',
                    phoneNo:accessToken,
                    resetToken:accessToken,
                    verified_email:true,
                    isthirdparty:true,
                }).save().then((currentuser)=>{
                done(null,currentuser)
                })
            }
            token()
        }
    })
  }
));
//----------------------------------------------------------google route
router.get("/google",passport.authenticate("google", {
    scope: ["profile", "email"]
  }
  ));
//google redirect route
router.get("/google/redirect",
passport.authenticate("google" ,
{
  failureRedirect: "http://shubh-kadam-psql.herokuapp.com/user/register"
}
),
(req,res)=>{
res.send(req.user)    
});

//---------------------------------------------------------------facebook route
router.get("/facebook",passport.authenticate("facebook"));
//facebook redirect route
router.get("/facebook/redirect",
passport.authenticate("facebook",
{
   failureRedirect: "http://shubh-kadam-psql.herokuapp.com/user/register"
 }
),
(req,res)=>{
 res.send(req.user)    
});

//-------------------------------------------------------Get Request Route
router.get("/user/verify/:token", get.verify_user_email)


//-------------------------------------------------------Post Request Route
router.post("/user/register", [
    check('name').isLength({ min: 3 }).withMessage('Must be at least 3 chars long'),
    check('email').isEmail(),
    check("phoneNo").isLength(10).withMessage("phoneNo is not valid"),
    check('password').isAlphanumeric().withMessage('Must be only alphaNumeric chars').isLength({ min: 8 }).withMessage('Must be at least 8 chars long')
], post.register_user)
router.post("/user/login", post.login_user)
router.post("/user/forgot_password", post.forgot_password)

//-------------------------------------------------------Put Request Route
router.put("/user/forgot_password/:resetToken", [
    check('newpassword').isAlphanumeric().withMessage('Must be only alphaNumeric chars').isLength({ min: 8 }).withMessage('Must be at least 8 chars long')
], put.forgot_password)
//-------------------------------------------------------Delete Request Route
router.delete("/user/logout/:userToken", delete1.logout_user)
router.delete("/user/deactivate/:userToken",delete1.deactivate_account)




module.exports = router