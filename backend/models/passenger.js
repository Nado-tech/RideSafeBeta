const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Passenger = sequelize.define('Passenger', {
    id: {type: DataTypes.INTEGER, // Corrected data type
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true, // Validates email format
        },
    },
    nin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures NIN is unique
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true, 
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Passenger;
