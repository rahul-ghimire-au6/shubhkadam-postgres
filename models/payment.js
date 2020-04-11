const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class payment extends Model {
}

const paymentSchema = {
    user_id: { type: Sequelize.TEXT, allowNull: true},    
    order_id:{type:Sequelize.TEXT,allowNull:true},
    razor_payment_id:{type:Sequelize.TEXT},
    razor_signature:{type:Sequelize.TEXT}
}
payment.init(paymentSchema, {
    sequelize, tableName: "payments"
})
module.exports = payment