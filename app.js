const express = require("express")
const dotenv=require("dotenv")
dotenv.config()
require("./db")
const userRoute=require("./routes/userRoutes")
const app=express()
// const {}=require("sequelize")
const users=require("./models/usermodel")
app.use(express.json())
app.use(userRoute)

 

module.exports=app