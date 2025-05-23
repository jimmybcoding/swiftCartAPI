'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShoppingCarts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShoppingCarts');
  }
};
