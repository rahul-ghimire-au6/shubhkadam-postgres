const reviews = require("../models/review")
const randomstring = require("randomstring")
const products = require("../models/product")
const payment1 = require("../models/payment")
const productsPD = require("../models/productPreciseDetail")
const productsColorandQuantity = require("../models/productClrBySize")
const carts = require("../models/cart")
const sequelize = require("sequelize")
const Razorpay = require('razorpay')
const order_placed = require("../models/order_placed")
let val = undefined
let { RAZOR_PAY_KEY_ID, RAZOR_PAY_SECRET } = process.env
let instance = new Razorpay({
   key_id: RAZOR_PAY_KEY_ID,
   key_secret: RAZOR_PAY_SECRET
})

module.exports = {
   get1: {
      async search_products(req, res) {
         try {
            const { value } = req.body
            console.log(value)
            const all_products = await products.findAll({ where: { [sequelize.Op.or]: [{ category: value }, { name: value }, { brand: value }] } })
            if (all_products.length == 0) return res.json("no shoes found")
            res.json(all_products)
         }
         catch (err) {
            console.log(err.message)
            return res.json("Server Error")
         }
      },
      // ------------------to view products---------------
      async products_view(req, res) {
         const { gender } = req.params
         const { pageNo } = req.query
         try {
            offset = pageNo * 2
            limit = 2
            const all_products = await products.findAll({ limit, offset, where: { gender: gender } })
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
         let sizeArr = []
         try {
            const product = await products.findOne({ where: { id: productId } })
            const user_review = await reviews.findAll({ where: { product_id: productId } })
            const product_details = await productsPD.findAll({ where: { product_id: productId } })
            const productColor = await productsColorandQuantity.findAll({ where: { product_id: productId } })
            for (j = 0; j < product_details.length; j++) {
               let colorArr = []
               for (k = 0; k < productColor.length; k++) {
                  if (product_details[j].id == productColor[k].product_sizeID) {
                     colorObj = {
                        color: productColor[k].color,
                        quantity: productColor[k].quantity
                     }
                     colorArr.push(colorObj)
                  }
                  detailsObj = {
                     size: product_details[j].size,
                     price: product_details[j].price,
                     color: colorArr
                  }
               }
               sizeArr.push(detailsObj)
            }
            if (user_review) {
               for (let i = 0; i < user_review.length; i++) {
                  const productReviewObj = {
                     name: user_review[i].name,
                     review: user_review[i].review,
                     star: user_review[i].star
                  }
                  reviewArray.push(productReviewObj)
               }
               return res.json({ product: product, productdetail: sizeArr, review: reviewArray })
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

         const userCart = await carts.findAll({ where: { user_id: userId } })
         let totalPrice = 0
         let cartArray = []
         for (i = 0; i < userCart.length; i++) {
            const productDetail = await products.findOne({ where: { id: userCart[i].product_id } })
            totalPrice = totalPrice + ((userCart[i].price) * userCart[i].quantity)
            newobj = {
               cartId: userCart[i].id,
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
            const { gender } = req.params
            const { value, size } = req.body
            if (value == "ascending_date") {
               const all_products = await products.findAll({ where: { gender: gender }, order: sequelize.literal('id ASC') })
               res.send(all_products)
            }
            else if (value == "descending_date") {
               const all_products = await products.findAll({ where: { gender: gender }, order: sequelize.literal('id DESC') })
               res.send(all_products)
            }
            else if (value == "high_price") {
               const all_products = await products.findAll({ where: { gender: gender }, order: sequelize.literal('basic_price DESC') })
               res.send(all_products)
            }
            else if (value == "low_price") {
               const all_products = await products.findAll({ where: { gender: gender }, order: sequelize.literal('basic_price ASC') })
               res.send(all_products)
            }
         }
         catch (err) {
            console.log(err.message)
            res.send("serverError")
         }
      },
      async product_delete_from_cart(req, res) {
         try{
         const user = req.user
         const { cartId } = req.params
         const { quantity } = req.body
         const cart_products = await carts.findOne({ where: { [sequelize.Op.and]: [{ user_id: user.id }, { id: cartId}] } })
         if(quantity==0){
            cart_products.quantity=0
            cart_products.destroy()
         }else{
            cart_products.quantity=quantity
            await cart_products.update({quantity:quantity})
         }
         res.json(cart_products)
      }
      catch(err){
         console.log(err.message)
         res.json({"message":"ServerError"})
      }
      }
   },
   post1: {
      // ----------------------------order place controller
      async order_place(req, res) {
         try {
            const user = req.user
            const { Address } = req.body
            const userCart = await carts.findAll({ where: { user_id: user.id } })
            let totalPrice = 0
            let orderArray = []
            for (i = 0; i < userCart.length; i++) {
               const productDetail = await products.findOne({ where: { id: userCart[i].product_id } })
               totalPrice = totalPrice + ((userCart[i].price) * userCart[i].quantity)
               newobj = {
                  num: i + 1,
                  image: productDetail.image_url1,
                  name: productDetail.name,
                  size: userCart[i].size,
                  quantity: userCart[i].quantity,
                  price: userCart[i].price,
               }
               orderArray.push(newobj)
            }
            const order = await order_placed.create({ user_id: user.id, order_place: orderArray, total_price: totalPrice, Address: Address })
            order.save()
            console.log()
            await res.json({ order })
         }
         catch (err) {
            console.log(err.message)
            res.json("serverError")
         }
      },
      // -----------------------------to post the review by users
      async post_reviews(req, res) {
         try {
            const { review, star } = req.body
            const { productId } = req.params
            const user = req.user
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
      //  to add the cart by user
      async add_to_cart(req, res) {
         try {
            const { size, color, quantity } = req.body
            const { productId } = req.params
            const user = req.user
            const product = await products.findOne({ where: { id: productId } })
            let count1 = 0
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
      },
      // to generate order and order Id
      async generate_order(req, res) {
         try {
            let user = req.user
            let temp = req.body
            let options = {
               amount: temp.amount,  // amount in the smallest currency unit
               currency: "INR",
               receipt: randomstring.generate(7),
               payment_capture: 1
            };
            instance.orders.create(options, (err, order) => {
               if (err) throw err
               val = order;
            }).then(() => {
               let paymentobj = {
                  user_id: user.id,
                  order_id: val.id,
                  razor_payment_id: null,
                  razor_signature: null
               }
               let yahoo = async () => {
                  let order = await payment1.create(paymentobj)
                  order.save()
                  res.send(val)
               }
               yahoo()
            })
         } catch (err) {
            console.log(err)
         }
      },
      //  to pay the payment using razor pay
      async razor_pay_success(req, res) {
         console.log(req.body)
         const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
         const payment = await payment1.findOne({ order_id: razorpay_order_id })
         payment.update({ razor_payment_id: razorpay_payment_id, razor_signature: razorpay_signature })
      }
   }
}