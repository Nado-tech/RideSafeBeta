'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Passengers',{
       id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          email: {
              type: Sequelize.STRING,
              allowNull: true,
              unique: true,
              validate: {
                  isEmail: true,
              },
          },
          nin: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true,
          },
          phonenumber: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: {
                  isNumeric: true, 
              },
          },
          password: {
              type: Sequelize.STRING,
              allowNull: false,
          },
          createdAt: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
          },
          updatedAt: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
          },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Passengers");
  }
};
