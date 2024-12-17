const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.INTEGER, // Corrected data type
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
    plateNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    vehicle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tokenExpiration: {
        type: DataTypes.DATE,
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

module.exports = Driver;
