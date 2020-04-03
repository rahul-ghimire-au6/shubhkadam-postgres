const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")

class product extends Model{

}
const productSchema = {
    name:{type:Sequelize.TEXT,allowNull:false},
    category: { type: Sequelize.TEXT, allowNull: false },
    gender: { type: Sequelize.TEXT, allowNull: false },
    image_url1: { type: Sequelize.TEXT, allowNull: false },
    image_url2: { type: Sequelize.TEXT },
    image_url3: { type: Sequelize.TEXT },
    image_url4: { type: Sequelize.TEXT },
    // details: [{
    //     size: { type: Sequelize.TEXT, allowNull: false },
    //     price:{type:Sequelize.TEXT,allowNull:false},
    //     colors: [{
    //         color: { type: Sequelize.TEXT, allowNull: false },
    //         quantity: { type: Sequelize.TEXT, allowNull: false }
    //     }]
    // }],
    inner_material: { type: Sequelize.TEXT },
    shoe_type: { type: Sequelize.TEXT },
    upper_material: { type: Sequelize.TEXT },
    brand: { type: Sequelize.TEXT, allowNull: false },
    sole_material: { type: Sequelize.TEXT },
    style_code: { type: Sequelize.NUMERIC(4, 0) ,allowNull:false, unique:true}
}
product.init(productSchema, {
    sequelize, tableName: "products_common_details"
})
module.exports = product