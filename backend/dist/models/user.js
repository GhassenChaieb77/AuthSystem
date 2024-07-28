"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class User extends sequelize_1.Model {
        static associate(models) {
            User.hasMany(models.Token, {
                foreignKey: 'userId',
                as: 'tokens',
            });
        }
    }
    User.init({
        firstName: sequelize_1.DataTypes.STRING,
        lastName: sequelize_1.DataTypes.STRING,
        email: sequelize_1.DataTypes.STRING,
        password: sequelize_1.DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
