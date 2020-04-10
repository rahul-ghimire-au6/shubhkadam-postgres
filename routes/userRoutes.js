const { get, post, put, delete1 } = require("../controllers/userController")
const { Router } = require("express")
const router = Router()
const { check } = require("express-validator")
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