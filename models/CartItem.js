'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      CartItem.belongsTo(models.ShoppingCart, { foreignKey: 'shoppingcart_id', onDelete: 'CASCADE' });
      CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product', onDelete: 'CASCADE' });
    }
  }
  CartItem.init({
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
    product_id: {  
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',  
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'CartItem',
    timestamps: false
  });
  
  return CartItem;
};

