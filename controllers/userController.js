const users = require("../models/usermodel")
const { verify } = require("jsonwebtoken")
const email1 = require('../utils/nodeMailer')
const { validationResult } = require("express-validator")
const authy = require('authy')(process.env.authy_api_key);
let authy_user_id = undefined
module.exports = {
    get: {
        async verify_user_email(req, res) {
            try {
                console.log(req.params.token)
                let temp = req.params.token
                console.log(temp)
                console.log('look up')
                let user1 = await users.find_user_by_token(temp)
                await res.send("email verified successfully")
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
                if (user.verified_email === false) {
                    return res.json({ "message": "Please verify your email first" })
                } else {
                    const accesToken = await user.generateToken()
                    res.status(201).json({
                        statusCode: 201,
                        token: accesToken
                    })
                }
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
                    // otp sms

                    authy.register_user(email, phoneNo, '+91', function (err, res) {
                        if (err) { console.log(err) }
                        console.log(res)
                        authy_user_id = res.user.id
                        NewUser.otp_id = authy_user_id
                        NewUser.save()
                        // authy.request_sms(authy_user_id, true, (err, res, ) => {
                        //     if (err) {
                        //         console.log(err)
                        //     }
                        // });
                    });
                    setTimeout(() => {
                        res.status(201).json({ statusCode: 201, NewUser })
                    }, 3000);

                }
                catch (err) {
                    console.log(err)
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

                if (user.dataValues.verified_email === false) {
                    return res.json({ "message": "please verify your email first" })
                }
                else {
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
                }

            } catch (err) {
                if (err.message === "email not found") return res.send(err.message)
                console.log(err.message)
                res.status(500).send("server error")
            }
        }, // verify phone no. otp---------------------------------------
        async verify_phoneNo_otp(req, res) {
           try {
              const { userid } = req.params
              const authy_token = req.body.token
              const user = await users.findOne({where:{ id: userid }})
              let temp=false;
              authy.verify(user[0].otp_id, authy_token, (err,res) => {
                 if(err){
                    console.log(err)
                    temp=false
                 }
                 else{
                    console.log(res)
                    if(res.success===true){
                       temp=true;
                    }
                 }
              });
              setTimeout(() => {
                    if(temp==true){
                       user[0].verified_mobile=true
                       user[0].save()
                       res.status(200).json({statuscode: 200, 'message': 'Phone Number verified successfully'})
                    }
                    else{
                       res.status(200).json({statuscode: 400, 'message': 'Phone Number Not verified successfully/Something went wrong'})
                    }  
                 }, 5000);
           } catch (err) {
              console.log(err.message)
              res.send("ServerError")
           }
        }
        //----------------------------------------------------------------------------end
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

                        user.update({ password: newpassword })
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
        },
        async deactivate_account(req, res) {
            try {
                const { userToken } = req.params
                const user = await users.delete_user_by_token(userToken)
                if (user.isthirdparty === false) {
                    let subject = `Account Deactivation`
                    let html = `<h2>ShubhKadam.com</h2>
                           <h3>Dear ${user.name}, Seems like you Deactivated your Account for ShubhKadam.com.
                            We Hope To See You Again.</h3>
                           `;
                    email1(user.email, subject, html)
                    return res.json({ success: true, "msg": "thanks for choosing shubhkadam hope we will see you again" })
                }
                else {
                    throw new Error("this feature is not available for third party signedin users")
                }
            } catch (err) {
                if (err.message === 'this feature is not available for third party signedin users') {
                    return res.json({ success: false, "msg": "this service is only available for third party signedin in users" })
                }
                else {
                    console.log(err.message)
                    res.status(500).send("server error")
                }
            }
        }
        //----------------------------------------------------------------------------end
    }
}