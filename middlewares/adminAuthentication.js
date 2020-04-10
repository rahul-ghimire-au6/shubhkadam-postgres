var admins = require("../models/admin");
module.exports = async (req, res, next) => {
    try {
        if (req.header("Authorization")) {
            const adminToken = req.header("Authorization")
            const admin = await admins.findOne({ where: { token: adminToken } })
            if (admin){
                req.admin = admin
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