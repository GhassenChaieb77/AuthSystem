"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    class Token extends sequelize_1.Model {
        static associate(models) {
            Token.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }
    Token.init({
        userId: sequelize_1.DataTypes.INTEGER,
        token: sequelize_1.DataTypes.STRING,
        state: sequelize_1.DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Token',
    });
    return Token;
};
