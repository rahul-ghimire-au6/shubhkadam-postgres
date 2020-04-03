//setting for environmental variables
const dotenv=require('dotenv')
dotenv.config()

//require coudinary
const cloudinary = require('cloudinary').v2
//setting for cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary