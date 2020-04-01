const sequelize = require("../db")
const { Sequelize, Model } = require("sequelize")
const { compare, hash } = require("bcryptjs")
const { sign } = require("jsonwebtoken")
const { SECRET_KEY } = process.env

class User extends Model {
    static async find_by_email_and_password(email, password) {
        try {
            const user = await User.findOne({
                where: {
                    email
                }
            });
            if (!user) throw new Error("Incorrect Credentials");
            const isMatched = await compare(password, user.password);
            if (!isMatched) throw new Error("Incorrect Credentials");
            return user;
        } catch (err) {
            throw err;
        }
    };
    static async find_by_email(email) {
        try {
            let temp1 = await User.findOne({ email: email });
            if (!temp1) {
                return "Invalid Credentials";
            }
            else {
                return temp1
            }
        } catch (err) {
            err.name = 'AuthError';
            throw err;
        }
    };
    static async generate_reset_token(user1) {
        try {
            const user = user1

            const token = await sign({ id: user._id }, process.env.secretkey, {
                expiresIn: "5m"
            })
            user.dataValues.resetToken = token
            user.save()
            return token
        }
        catch (err) {
            console.log(err.message)
        }
    };
    static async nullifyToken(token) {
        try {
            const user = await User.findOne({ token: token })
            user.token = null;
            user.save()
            return user
        }
        catch (err) {
            console.log(err.message)
        }
    };
    static async find_user_by_token(token) {
        try {
            const user = await User.findOne({ token: token })
            user.verified = true;
            user.save()
            return user
        }
        catch (err) {
            console.log(err.message)
        }
    }
    async generateToken() {
        try {
            const user = this
            // SECRET_KEY = `${user.email}-${new Date(user.createdAt).getTime()}`
            // console.log(SECRET_KEY)
            const token = await sign({ id: user._id }, SECRET_KEY, {
                expiresIn: "30d"
            })
            user.token = token
            user.save()
            return token
        }
        catch (err) {
            console.log(err.message)
        }
    }
}

const userSchema = {
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
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
    phoneNo: {
        type: Sequelize.NUMERIC(10, 0),
        allowNull: false
    },
    resetToken: {
        type: Sequelize.TEXT
    },
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}
User.init(userSchema, {
    sequelize, tableName: "users"
})

User.beforeCreate(async user => {
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
});

User.beforeUpdate(async user => {
    if (user.changed("password")) {
        const hashedPassword = await hash(user.password, 10);
        user.password = hashedPassword;
    }
});
module.exports = User