'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Alerts", {
     id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey: true,
     },
     photo: {
       type: Sequelize.BLOB,
       allowNull: true,
     },
     latitude: {
       type: Sequelize.STRING,
       allowNull: true,
     },
     longitude: {
       type: Sequelize.STRING,
       allowNull: true,
     }
  })
},
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Alerts");
  }
};
