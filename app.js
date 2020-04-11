const express = require("express")
const dotenv=require("dotenv")
const cors = require("cors")
dotenv.config()
require("./db")
const app=express()
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 15* 60 * 1000, // 15 minutes
  max: 100
});
app.use( apiLimiter);
const userRoute=require("./routes/userRoutes")
const adminRoute=require("./routes/adminRoutes")
const productRoute=require("./routes/productRoutes")

app.use(
  cors({
      origin:"*",                     //"http://127.0.0.1:5500/addproduct.html",
      allowedHeaders: ["Content-Type","Authorization"],
      credentials: true
  })
);

// const {}=require("sequelize")
app.use(express.json())
app.use(userRoute)
app.use(adminRoute)
app.use(productRoute)


module.exports=app