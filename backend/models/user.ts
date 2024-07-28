import { Model, DataTypes, Sequelize, ModelCtor, ModelStatic } from 'sequelize';

export default (sequelize: Sequelize): ModelCtor<Model> => {
  class User extends Model {
    static associate(models: { Token: ModelStatic<Model> }) {
      User.hasMany(models.Token, {
        foreignKey: 'userId',
        as: 'tokens',
      });
    }
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,

    
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
