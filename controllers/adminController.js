const admins = require("../models/admin")
const products = require("../models/product")
const productsPD = require("../models/productPreciseDetail")
const productsColorandQuantity = require("../models/productClrBySize")
const fs = require('fs')
//requiring cloudinary
const cloudinary = require('../utils/cloudinary')
module.exports = {
    post: {
        //--------------------------------------------------------register admin logic
        async register_user(req, res) {
            {

                try {
                    let user = req.body
                    const { email, password } = user
                    if (!email || !password)
                        return res.status(400).send("ValidationError")
                    const NewUser = await admins.create(user)
                    token = await NewUser.generate_admin_Token()
                    res.status(201).json({ statusCode: 201, NewUser })
                    //////////////////////end
                }
                catch (err) {
                    if (err.fields.hasOwnProperty("email")) {
                        return res.status(403).send(`Email already occupied`);
                    }
                    if (err.name === "ValidationError")
                        return res.status(400).send(`Validation Error: ${err.message}`);
                    console.log(err.message)
                    return res.status(500).send("Server Error");
                }
            }
        },
        //-------------------------------------------------------login admin --------
        async login_admin(req, res) {
            try {
                const { email, password } = req.body
                if (!email || !password)
                    return res.status(400).send("Incorrect Credentials")
                const admin = await admins.check_email_and_password(email, password)
                const accesToken = await admin.generate_admin_Token()
                res.status(201).json({
                    statusCode: 201,
                    token: accesToken
                })
            }
            catch (err) {
                console.log(err.message)
                if (err.message == "Incorrect Credentials") return res.status(400).send("Incorrect Credentials")
                return res.send("ServerError")
            }
        },
        // ---------------------add product by admin---------------------------
        async add_product(req, res) {
            try {
                const admin = req.admin
                if (admin) {
                    let { style_code } = req.body
                    const product = await products.findAll({ where: { style_code } })
                    console.log(product.length)
                    if (product.length != 0) return res.send("stylecode is already equipped")
                    else {
                        let temp1 = req.body
                        let img_url = [];
                        fs.readdir('uploads/', (err, data) => {
                            if (err) { throw err }
                            let temp = data
                            img_url.length = 0;
                            for (let i = 0; i < temp.length; i++) {
                                if (/.jpg$/.test(temp[i])) {
                                    cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                                        if (err) console.log(err.message)
                                        else {
                                            img_url.push(result.secure_url)
                                            fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                                        }
                                    });
                                }
                                else if (/.jpeg$/.test(temp[i])) {
                                    cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                                        if (err) console.log(err.message)
                                        else {
                                            img_url.push(result.secure_url)
                                            fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                                        }
                                    });
                                }
                                else if (/.png$/.test(temp[i])) {
                                    cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                                        if (err) console.log(err)
                                        else {
                                            img_url.push(result.secure_url)
                                            fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                                        }
                                    });
                                }
                                else if (/.webp$/.test(temp[i])) {
                                    cloudinary.uploader.upload(`uploads/${temp[i]}`, (err, result) => {
                                        if (err) console.log(err.message)
                                        else {
                                            img_url.push(result.secure_url)
                                            fs.unlink(`uploads/${temp[i]}`, (err) => { if (err) { throw err } else { console.log('deleted') } })
                                        }
                                    });
                                }

                            }
                        })
                        setTimeout(() => {
                            temp1.image_url1 = img_url[0]
                            temp1.image_url2 = img_url[1]
                            temp1.image_url3 = img_url[2]
                            temp1.image_url4 = img_url[3]
                            let newuser = new products({ ...temp1 })
                            let data159 = async () => {
                                let val159 = await newuser.save()
                                await console.log(val159)
                                res.json(val159)
                            }
                            data159();
                        }, 10000);
                    }
                } else {
                    res.send("kindly login first")
                }
            } catch (err) {
                if (err == "Validation error") return res.send("stylecode should be unique")
                console.log(err.message)
                return res.send("serverError")
            }

        },
        // ---------------------------------add product detail's  particular size and price
        async add_product_precise_details(req, res) {
            try {
              const admin = req.admin
                if (admin) {
                    const { style_code } = req.body
                    const productpd = req.body
                    const product = await products.findOne({ where: { style_code: style_code } })
                    if (product.length == 0) return res.send("product with this style code not found")

                    else {
                        productpd.product_id = product.dataValues.id
                        const product_size_detail = await productsPD.create(productpd)
                        product_size_detail.save()
                        res.json(product_size_detail)
                    }
                }
                else return res.send("Kindly login")
            }
            catch (err) {
                console.log(err.message)
                res.send("serverError")
            }
        },
        // -------------------------------------add color of the product's particular size-
        async add_products_clr_quantity(req, res) {
            try {
                const admin =req.admin
                if (admin) {
                    const { sizeID } = req.params
                    console.log(sizeID)
                    const value = req.body                  
                    const productDetails = await productsPD.findOne({ where: { id:sizeID} })
                    if (productDetails) {
                        value.product_sizeID = productDetails.id
                        value.product_id=productDetails.product_id
                        const product = await productsColorandQuantity.create(value)
                        product.save()
                        res.json(product)
                    }
                    else return res.send("")
                }
                else return res.send("kindly login first")
            }
            catch (err) {
                console.log(err)
                res.send("serverError")
            }
        }
    },
    delete1: {
        // ----------------logout admin--------------------------
        async logout_admin(req, res) {
            try {
                token = req.params.adminToken
                const admin = await admins.nullify_admin_token(token)
                res.json(admin)
            }
            catch (err) {
                console.log(err.message)
                res.status(500).send("server error")
            }
        }
    }
}