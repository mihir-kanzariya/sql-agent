'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define association here
        }
    };
    User.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        google_id: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        picture: {
            type: DataTypes.STRING
        },
        usage: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        role: {
            type: DataTypes.STRING
        },
        lastLoggedinDate: {
            type: DataTypes.DATE
        },
        geography: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        disable: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: "false"
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deletedAt: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
        paranoid: true
    });
    return User;
};
