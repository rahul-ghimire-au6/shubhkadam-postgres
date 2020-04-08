const users = require("../models/usermodel")
const { verify } = require("jsonwebtoken")
const email1 = require('../utils/nodeMailer')
const { validationResult } = require("express-validator")
module.exports = {
    get: {
        async register_user(req, res) {
            res.send('ok')
        },
        async login_user(req, res) {
            res.send('ok')
        },
        async verify_user_email(req, res) {
            try {
                console.log(req.params.token)
                let temp = req.params.token
                console.log(temp)
                console.log('look up')
                let user1 = await users.find_user_by_token(temp)
                await res.json(user1)
            }
            catch (err) {
                console.log(err.message)
                res.status(500).send("server error")
            }
        }
    },
    post: {
        //--------------------------------------------------------login user logic
        async login_user(req, res) {

            try {
                const { email, password } = req.body
                if (!email || !password)
                    return res.status(400).send("Incorrect Credentials")
                const user = await users.find_by_email_and_password(email, password)
                //  if(user.verified===false){
                //     return res.json({"message":"Please verify your email first"})
                //  }else{
                const accesToken = await user.generateToken()
                res.status(201).json({
                    statusCode: 201,
                    token: accesToken
                })
                //  }
            }
            catch (err) {
                console.log(err.message)
                if (err.message == "Incorrect Credentials") return res.status(400).send("Invalid Credentials")
                return res.send("ServerError")
            }
        },
        //--------------------------------------------------------register user logic
        async register_user(req, res) {
            {
                // Finds the validation errors in this request and wraps them in an object with handy functions
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() })
                }
                try {
                    let user = req.body
                    const { email, password, name, phoneNo } = user
                    console.log(user)
                    if (!email || !password || !name || !phoneNo)

                        return res.status(400).send("ValidationError")
                    const NewUser = await users.create(user)
                    NewUser.resetToken = null
                    token = await NewUser.generateToken()
                    let subject = `Welcome to ShubhKadam.com`
                    let html = `<h2>Thanks for Joining Us</h2>
                         <h3>Dear ${name} you are one step closer to become one of our prestigious family</h3>
                         <p>To verify your email Click <a href=http://localhost:5555/user/verify/${token} >here</a></p> or 
                         <p>click this link to your browser:- http://localhost:5555/user/verify/${token} </p>
                         <p>Thank you!!!!</p>`;

                    email1(email, subject, html)          //function to send email to the user
                    res.send(NewUser)

                }
                catch (err) {
                    // console.log(err)
                    if (err.fields.hasOwnProperty("email")) {
                        return res.status(403).send(`Email already occupied`);
                    }
                    else if (err.fields.hasOwnProperty("phoneNo")) {
                        return res.status(403).send(`phone number already registered`);
                    }
                    if (err.name === "ValidationError")
                        return res.status(400).send(`Validation Error: ${err.message}`);
                   
                    return res.status(500).send("serverError");
                }
            }
        },
        //----------------------------------------------------------------------------end
        //----------------------------------------------------------------------user forgot password logic
        async forgot_password(req, res) {
            try {
                let { email } = req.body
                const user = await users.find_by_email(email)
                console.log(user)
                // if (user.dataValues.verified === false) {
                //     return res.json({ "message": "please verify your email first" })
                // }
                // else {
                    const resetToken = await users.generate_reset_token(user)
                    let subject = `Password Reset`
                    let html = `<h2>ShubhKadam.com</h2>
                         <h3>Dear ${user.dataValues.name}, Seems like you forgot your password for ShubhKadam.com account. if this is true, click below to reset your password.</h3>
                         <button style="background-color: #338DFF; /* blue */
                         border: none;
                         color: white;
                         text-align: center;
                         text-decoration: none;
                         display: inline-block;
                         font-size: 16px;
                         margin: 4px 2px;
                         cursor: pointer;"><a href=http://localhost:5555/user/forgot_password/${resetToken}">Reset My Password</a></button> 
                         <p>copy paste this link to your browser:- http://localhost:5555/user/forgot_password/${resetToken}
                         <p style="color:red;">If you did not forgot your password you can safely ignore this email.</p>
                         <p>Thank you for choosing ShubhKadam.com</p>`;
                         console.log(user.dataValues.email)
                    email1(user.dataValues.email, subject, html)
                    res.status(200).json({ statuscode: 200, message: `We have send a reset password email to ${user.dataValues.email}. Please click the reset password link to set a new password.` })
                // }

            } catch (err) {
                console.log(err.message)
                res.status(500).send("server error")
            }
        },
        //----------------------------------------------------------------------------end
    },
    //----------------------------------------------------------------------------start of put request
    put: {
        async forgot_password(req, res) {
            {
                // Finds the validation errors in this request and wraps them in an object with handy functions
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(422).json({ errors: errors.array() })
                }
                const { resetToken } = req.params
                const { newpassword, cpassword } = req.body
                if (newpassword !== cpassword) return res.send("Password doesnt match")
                try {
                    const decoded = await verify(resetToken, process.env.secretkey)
                    if (decoded) {
                        const user = await users.findOne({ resetToken: resetToken })
                        // user.dataValues.password = newpassword
                        
                        user.update({password:newpassword})
                        console.log(user)
                        
                        res.send("password successfully changed")
                    }
                }
                catch (err) {
                    console.log(err.message)
                }
            }
        }


    },
    //-------------------------------------------------------------------------------end of put request
    //-------------------------------------------------------------------------------start of delete request
    delete1: {
        //------------------------------------------------------------------------user logout logic
        async logout_user(req, res) {
            try {
                token = req.params.userToken
                const user = await users.nullifyToken(token)
                res.json(user)
            }
            catch (err) {
                console.log(err.message)
                res.status(500).send("server error")
            }
        }
        //----------------------------------------------------------------------------end
    }
}