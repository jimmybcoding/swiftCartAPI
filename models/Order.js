'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Each order is linked to a shopping cart
      Order.belongsTo(models.ShoppingCart, { foreignKey: 'shoppingcart_id' });
    }
  }

  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    shoppingcart_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ShoppingCarts',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
