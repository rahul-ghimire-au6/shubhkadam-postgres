const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class reviews extends Model {
}

const reviewSchema = {
    user_id:{type:Sequelize.TEXT,allowNull:false},
    name: { type: Sequelize.TEXT, allowNull:false},
    review:{type:Sequelize.TEXT,allowNull:false},
    star:{type:Sequelize.NUMERIC(4, 1)},
    product_id:{type:Sequelize.TEXT}
}
reviews.init(reviewSchema, {
    sequelize, tableName: "reviews"
})
module.exports = reviews