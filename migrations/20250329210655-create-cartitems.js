'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      product_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      shoppingcart_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'ShoppingCarts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      }

    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('CartItems');
  }
};
