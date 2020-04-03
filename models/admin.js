const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")
const { compare, hash } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const { SECRET_KEY } = process.env

class Admin extends Model {
    async generate_admin_Token  () {
        try {
          let admin = this
          const token = await sign({ id: admin.dataValues._id }, SECRET_KEY, {
            expiresIn: "30d"
          })
          admin.token = token
          console.log(admin)
          await admin.save()
          return token
        }
        catch (err) {
          console.log(err)
        }
      }
      static async check_email_and_password(email, password) {
        try {
          const admin = await Admin.findOne({ email: email,password:password });
          if (!admin) throw new Error("Invalid Credentials");
          return admin;
        } catch (err) {
          err.name = 'AuthError';
          throw err;
        }
      }
    static async nullify_admin_token(token) {
        try {
            const admin = await Admin.findOne({ token: token })
            admin.token = null;
            admin.save()
            return admin
        }
        catch (err) {
            console.log(err.message)
        }
    };
   
}

const adminSchema = {
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    token: {
        type: Sequelize.TEXT
    },
}
Admin.init(adminSchema, {
    sequelize, tableName: "admins"
})

Admin.beforeCreate(async admin => {
    const hashedPassword = await hash(admin.password, 10);
    admin.password = hashedPassword;
});

Admin.beforeUpdate(async admin => {
    if (admin.changed("password")) {
        const hashedPassword = await hash(admin.password, 10);
        admin.password = hashedPassword;
    }
});
module.exports = Admin