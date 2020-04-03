const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class ProductPD extends Model {
}

const productclrSchema = {
    style_code: { type: Sequelize.NUMERIC(4, 0) ,allowNull:false, unique:true},
        size: { type: Sequelize.TEXT, allowNull: false },
        price:{type:Sequelize.TEXT,allowNull:false},
        product_id:{type:Sequelize.TEXT,unique:true}
}
ProductPD.init(productclrSchema, {
    sequelize, tableName: "product_size_details"
})
module.exports = ProductPD