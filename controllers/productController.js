const reviews = require("../models/review")
const users = require("../models/usermodel")
const products = require("../models/product")
const productsPD = require("../models/productPreciseDetail")
const productsColorandQuantity = require("../models/productClrBySize")
const carts = require("../models/cart")
const sequelize = require("sequelize")

module.exports = {
   get1: {
      // ------------------to view products---------------
      async products_view(req, res) {
         const { gender } = req.params
         try {
            const all_products = await products.findAll({where:{ gender: gender}})
            const productDetail = await productsPD.findAll()
            await res.json(all_products)
         }
         catch (err) {
            console.log(err)
         }
      },
      // --------------------------to view the product detail and its review-----------------
      async product_details(req, res) {
         const { productId } = req.params
         let reviewArray = []
         try {
            const product = await products.findOne({ where: { id: productId } })
            const user_review = await reviews.findOne({ where:{product_id: productId} })
            if (user_review) {
               for (let i = 0; i < user_review.length; i++) {
                  const productReviewObj = {
                     review: user_review[i].review,
                     star: user_review[i].star
                  }
                  reviewArray.push(productReviewObj)
               }
               res.json({ product: product, review: reviewArray })
            }
            else {
               res.json({ product: product, review: "no reviews till now" })
            }
         }
         catch (err) {
            console.log(err)
         }
      },
      //--------------to view the cart page--------------
      async cartPage(req, res) {
         const { userId } = req.params
         const userCart = await carts.findAll({where:{ user_id: userId }})
         let totalPrice = 0
         let cartArray = []
         for (i = 0; i < userCart.length; i++) {
            const productDetail = await products.findOne({where:{ id: userCart[i].product_id} })
            totalPrice = (userCart[i].price) + totalPrice
            newobj = {
               num: i + 1,
               image: productDetail.image_url1,
               name: productDetail.name,
               size: userCart[i].size,
               quantity: userCart[i].quantity,
               price: userCart[i].price,
            }
            cartArray.push(newobj)
         }
         await res.json({ products: cartArray, totalPrice: totalPrice })
      },
      // ----------to sort the product---------
         async sort_the_product(req, res) {
            try {
               const { value, size } = req.body
               if (value == "ascending_date") {
                  const all_products = await products.findAll({where:{ order: sequelize.literal('id ASC')} })
                  res.send(all_products)
               }
               else if (value == "descending_date") {
                  const all_products = await products.findAll({where:{ order: sequelize.literal('id DESC')} })
                  res.send(all_products)
               }
               else if (value == "high_price") {
                  const all_products = await products.findAll({where:{ order: sequelize.literal('basic_price DESC') }})
                  res.send(all_products)
               }
               else if (value == "low_price") {
                  const all_products = await products.findAll({where:{ order: sequelize.literal('basic_price ASC') }})
                  res.send(all_products)
               }
               else if (size) {
                  const all_products = await products.findAll({where:{ "details.size": size} })
                  if (all_products.length == 0) return res.send(`product of size ${size} is not available right now..come again later `)
                  res.send(all_products)
               }
            }
            catch (err) {
               console.log(err.message)
               res.send("serverError")
            }
         }
   },
   post1: {
      async post_reviews(req, res) {
         try {
            const { review, star } = req.body
            const { productId } = req.params
            const userToken = req.header('Authorization');
            const user = await users.find_user_by_token({ where: { token: userToken } })
            console.log(user.id)
            newReview = await reviews.create({
               user_id: user.id,
               name: user.name,
               review: review,
               star: star,
               product_id: productId
            })
            newReview.save()
            res.json(newReview)
         }
         catch (err) {
            console.log(err.message)
            res.send("server error")
         }
      },
      async add_to_cart(req, res) {
         try {
            const { size, color, quantity } = req.body
            const userToken = req.header("Authorization")
            const { productId } = req.params
            const user = await users.find_user_by_token(userToken)
            const product = await products.findOne({where:{ _id: productId }})
            let count1 = 0
            let count2 = 0
            let count3 = 0
            const productdetail = await productsPD.findAll({ where: { style_code: product.style_code } })
            for (i = 0; i < productdetail.length; i++) {
               if (productdetail[i].size == size) {
                  const productcolors = await productsColorandQuantity.findAll({ where: { product_sizeID: productdetail[i].id } })
                  for (j = 0; j < productcolors.length; j++) {
                     if (productcolors[j].color == color) {
                        if ((productcolors[j].quantity) >= quantity) {
                           const price = (productdetail[i].price) * quantity
                           const cart = {
                              user_id: user.id,
                              product_id: productId,
                              size: size,
                              color: color,
                              quantity: quantity,
                              price: price
                           }
                           console.log(cart)
                           cart1 = await carts.create(cart)
                           await cart1.save()
                           return res.json(cart1)
                        }
                        else return res.send(`out of stock`)
                     }
                     else {
                        count1 = count1 + 1
                        continue
                     }
                  }
                  if (count1 > productcolors.length - 1) return res.send(` ${color} color is not available right now, it will come soon`)
               }
               else {
                  count3 = count3 + 1
                  continue
               }
            }
            if (count3 > productdetail.length - 1) return res.send(`size ${size} is not available right now, it will come soon `)
         }
         catch (err) {
            console.log(err)
         }
      }
   }
}