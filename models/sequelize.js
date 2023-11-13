// config/sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root', // Ganti dengan username Anda
  password: '',
  database: 'todolistapp',
  port: 3306,
});

module.exports = sequelize;
