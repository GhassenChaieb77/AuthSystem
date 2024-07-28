import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Token extends Model {
    static associate(models) {
      // define association here
      Token.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Token.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Token',
  });

  return Token;
};
