const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.DB_NAME,
  process.DB_USER,
  process.DB_PASSWORD,
  {
    host: process.DB_HOST,
    port: process.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false
    },
    timezone: '-05:00' // Hora de Perú (UTC-5)
  }
);

module.exports = sequelize;
