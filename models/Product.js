'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'cartItems', onDelete: 'CASCADE' });
      Product.belongsToMany(models.Order, { through: 'OrderItems', foreignKey: 'product_id' });
    }
  }

  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 
    }
  }, {
    sequelize,
    modelName: 'Product',
    timestamps: false
  });

  return Product;
};
