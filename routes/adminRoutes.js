const { get, post, put, delete1} = require("../controllers/adminController")
const { Router } = require("express")
//requiring and setting up multer 
const upload = require('../utils/multer')

const router = Router()
router.post("/admin/register",post.register_user)
router.post("/admin/login",post.login_admin)
router.post("/admin/addproducts",upload.array("product_img",4),post.add_product)
router.post("/admin/addpreciseproductdetail",post.add_product_precise_details)
router.post("/admin/addproductcolor/:product_detail_id",post.add_products_clr_quantity)
// router.patch("/admin/editProducts/:productId",patch.edit_product)
// router.delete("/admin/deleteProduct/:productId",patch.delete_product)
router.delete("/admin/logout/:adminToken",delete1.logout_admin)
module.exports=router