'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class finetune extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  finetune.init({
    user: DataTypes.STRING,
    assistant: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    model_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'finetune',
  });
  return finetune;
};