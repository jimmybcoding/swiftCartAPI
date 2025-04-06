'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShoppingCart extends Model {
    static associate(models) {
      ShoppingCart.hasMany(models.CartItem, { foreignKey: 'shoppingcart_id', onDelete: 'CASCADE' });
    }
  }
  ShoppingCart.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ShoppingCart',
    timestamps: false
  });
  return ShoppingCart;
};
