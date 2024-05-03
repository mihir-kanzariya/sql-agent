'use strict';
const {
  Model: seqModel
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Model extends seqModel {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Model.init({
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Model',
  });
  return Model;
};