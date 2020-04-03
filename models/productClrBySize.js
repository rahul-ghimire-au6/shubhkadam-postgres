const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class ProductCbyS extends Model {
}

const productdetailedSchema = {
    color: { type: Sequelize.TEXT, allowNull: false },
    quantity: { type: Sequelize.TEXT, allowNull: false },
    product_sizeID:{ type: Sequelize.TEXT, allowNull: false }
}
ProductCbyS.init(productdetailedSchema, {
    sequelize, tableName: "product_colors_by_size"
})
module.exports = ProductCbyS