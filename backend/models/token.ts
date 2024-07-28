import { Model, DataTypes, Sequelize, ModelCtor, ModelStatic } from 'sequelize';

export default (sequelize: Sequelize): ModelCtor<Model> => {
  class Token extends Model {
    static associate(models: { User: ModelStatic<Model> }) {
      Token.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Token.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    state: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Token',
  });

  return Token;
};
