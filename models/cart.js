const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class cart extends Model {
}

const cartSchema = {
    user_id: { type: Sequelize.TEXT, allowNull: false },
    product_id: { type: Sequelize.TEXT },
     quantity: { type: Sequelize.NUMERIC },
      size: { type: Sequelize.NUMERIC },
       color: { type: Sequelize.TEXT },
       price:{type:Sequelize.NUMERIC} 
}
cart.init(cartSchema, {
    sequelize, tableName: "cart"
})
module.exports = cart