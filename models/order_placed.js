const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class orders extends Model {
}

const orderSchema = {
    user_id: { type: Sequelize.TEXT, allowNull: false },
    order_place: [{ type: Sequelize.TEXT }],
    total_price:{type:Sequelize.TEXT},
    Address: { type: Sequelize.TEXT }
}
orders.init(orderSchema, {
    sequelize, tableName: "order"
})
module.exports = orders