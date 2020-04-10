const { get1, post1, put1, delete1 } = require("../controllers/productController")
const { Router } = require("express")
const router = Router()
const authentication=require("../middlewares/userAuthentication")
router.post("/review/:productId",authentication,post1.post_reviews)
router.get("/shoes/product/:productId",get1.product_details)
router.get("/shoes/:gender",get1.products_view)
router.get("/user/cart/:userId",get1.cartPage)
router.get("/user/sortproduct/:gender",get1.sort_the_product)
router.post("/user/addToCart/:productId",authentication,post1.add_to_cart)

module.exports=router