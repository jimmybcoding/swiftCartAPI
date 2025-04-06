//per neon docs insert initial products into table

'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('dotenv');
config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: { require: true },
  },
});

const Product = require('../models/Product')(sequelize, DataTypes);

module.exports = {
  up: async () => {
    await Product.bulkCreate([
      {
        name: 'Sony TV',
        description: '50 inch, 4K display',
        price: 500.99,
        in_stock: 10
      },
      {
        name: 'LG TV',
        description: '65 inch OLED display',
        price: 999.99,
        in_stock: 5
      },
      {
        name: 'Samsung TV',
        description: '50 inch 4k display',
        price: 400.99,
        in_stock: 12
      },
      {
        name: 'TCL TV',
        description: '65 inch OLED display',
        price: 800.99,
        in_stock: 15
      },
      {
        name: 'Vizio TV',
        description: '50 inch 4k display',
        price: 300.99,
        in_stock: 8
      }
    ]);
  }
};
