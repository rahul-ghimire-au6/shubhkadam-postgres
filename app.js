const express = require("express")
const dotenv=require("dotenv")
dotenv.config()
require("./db")
const userRoute=require("./routes/userRoutes")
const adminRoute=require("./routes/adminRoutes")
const productRoute=require("./routes/productRoutes")
const app=express()
// const {}=require("sequelize")
app.use(express.json())
app.use(userRoute)
app.use(adminRoute)
app.use(productRoute)

 

module.exports=app