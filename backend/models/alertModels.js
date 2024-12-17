const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  photo: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Alert;
