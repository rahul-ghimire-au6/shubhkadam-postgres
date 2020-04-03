const express = require("express")
const dotenv=require("dotenv")
dotenv.config()
require("./db")
const userRoute=require("./routes/userRoutes")
const adminRoute=require("./routes/adminRoutes")
const app=express()
// const {}=require("sequelize")
const users=require("./models/usermodel")
app.use(express.json())
app.use(userRoute)
app.use(adminRoute)

 

module.exports=app