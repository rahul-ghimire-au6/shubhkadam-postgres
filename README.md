# SHUBH KADAM

MongoDB API Website :- shubh-kadam.herokuapp.com

PostgreSQL API Website:- shubh-kadam-psql.heroku.com

## Technologies used for ShubhKadam

Authy , Bcryptjs, Cloudinary, Cors, Dotenv, Express, Express-rate-limit, Express-validator, Jsonwebtoken, Multer, Nodemailer, Passport, Passport-facebook, Passport-google-oauth, Razorpay, Randomstring, MongoDB, Sequelize, Jest ,Supertest , Morgan , nodemon

Gender: men,women,kids

Size: 8,9,10,11

## User EndPoints

## IDs, Email, phoneNo unique

Register User:-

POST – (&quot;user/register&quot;)

Body: name,email,password,phoneNo

Login User:-

POST-(&quot;user/login&quot;)

Body:email,password

Logout User:-

DELETE - (&quot;user/logout/:userToken&quot;&quot;)

Forgot Password to send email

POST – (&quot;user/forgot\_password&quot;)

Body:email

Put New Password

PUT – (&quot;user/forgot\_password/:resetToken&quot;)

Body:newpassword,cpassword

Verify Email

GET – (&quot;/user/verify/:token&quot;)

Verify SMS Otp

POST – (&quot;/user/verifyotp/:userid&quot;)

Body:token

Google Sign In

GET – (&quot;/google&quot;)

Facebook Sign In

GET – (&quot;/facebook&quot;)

## Admin EndPoints

## Ids, Email unique

Register Admin:-

POST – (&quot;admin/register&quot;)

Body: email, password

Login User:-

POST-(&quot;admin/login&quot;)

Body:email,password

Logout User:-

DELETE - (&quot;admin/logout/:userToken&quot;&quot;)

Add products common details

(Admin Authorization)

POST – (&quot;/admin/addproducts&quot;)

Body- name, category, gender, product\_img (image\_url1), product\_img (image\_url2), Product\_img (image\_url3), Product\_img (image\_url4), basic\_price, inner\_material, shoe\_type, upper\_material, brand, sole\_material, style\_code

Add products size and price of the particular products

(Admin Authorization)

POST –(&quot; /admin/addpreciseproductdetail&quot;)

Body- style\_code, size, price

Add product&#39;s different color and quantity of the particular size of the products

(Admin Authorization)

POST –(&quot; /admin/addproductcolor/:sizeID&quot;)

Body-color, quantity

To see All the order which the users has placed

(admin authorization)

Get - (&quot;/orders)

## Products EndPoints

## IDs, Style\_code unique

To search the products by category, brand and name of the products

GET-(&quot;/shoes/products&quot;)

Body – value:(value of the category name and brand)

Product view

GET- (&quot;/shoes/:gender/?pageNo=&quot;)

Product Details

GET- (&quot;/shoes/product/:productId&quot;)

Sorting The Products

GET – (&quot;/user/sortproduct/:gender&quot;)

Body- &quot;value&quot;: (ascending\_date, descending\_date, high\_price, low\_price)

Cart Page

GET – (&quot;/user/cart/:userId&quot;)

Post Reviews(User Authorization)

POST - (&quot;/review/:productId&quot;)

Body- review, star

Add To Cart(User Authorization)

POST - (&quot;/user/addToCart/:productId&quot;)

Body – size, color, quantity

To delete particular product from the cart

GET - (&quot;/cartproducts/delete/:cartId&quot;)

Body -quantity

Generate order(User Authorization)

POST - (&quot;/create&quot;)

Body-amount

RazorPay Success

POST-(&quot;/success&quot;)
