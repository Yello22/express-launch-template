const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelizeConnect")
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please tell us your name!',
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Please provide a valid email',
            },
            notNull: {
                msg: 'Please provide your email',
            },
        },
        lowercase: true,
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: 'default.jpg',
    },
    /*roles: {
        type: DataTypes.JSON,
        defaultValue: ['role:user'],
        validate: {
            isIn: {
                args: [['role:user', 'role:admin']],
                msg: 'Invalid role!',
            },
        },
        get() {
            const rawValue = this.getDataValue('roles');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('roles', JSON.stringify(value));
        },
    },*/
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please provide a password',
            },
            len: {
                args: [8, 100],
                msg: 'Password must be at least 8 characters long',
            },
        },
        select: false,
    },
    passwordConfirm: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please confirm your password',
            },
            isEqual(value) {
                if (value !== this.password) {
                    throw new Error('Passwords are not the same!');
                }
            },
        },
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        select: false,
    },
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
                user.passwordConfirm = undefined;
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.passwordChangedAt = Date.now() - 1000;
            }
        },
        beforeFind: (options) => {
            options.where = {
                ...options.where,
                active: { $ne: false },
            };
        },
    },
    instanceMethods: {
        correctPassword: async function (candidatePassword, userPassword) {
            return await bcrypt.compare(candidatePassword, userPassword);
        },
        changedPasswordAfter: function (JWTTimestamp) {
            if (this.passwordChangedAt) {
                const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
                return JWTTimestamp < changedTimestamp;
            }
            return false;
        },
        createPasswordResetToken: function () {
            const resetToken = crypto.randomBytes(32).toString('hex');
            this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
            return resetToken;
        },
    },
});

/*(async () => {
    await sequelize.sync({ force: true }).catch(err => {
        throw console.error(err)
    });
})();*/

module.exports = User;
