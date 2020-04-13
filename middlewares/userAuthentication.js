var users = require("../models/usermodel");
module.exports = async (req, res, next) => {
    try {
        if (req.header("Authorization")) {
            const userToken = req.header("Authorization")
            const user = await users.findOne({where:{token:userToken}})
            if (user) {
                if (user.verified_email == true) {
                    req.user = user
                }
                else return res.send("kindly verify your email first")
            }
        }
        else return res.send("kindly login first")
        next();
    }
    catch (err) {
        console.log(err.message);
        res.send("kindly login first")
    }
}