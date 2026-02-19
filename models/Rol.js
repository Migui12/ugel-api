// models/Rol.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('Rol', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  descripcion: {
    type: DataTypes.STRING(200)
  }
}, {
  tableName: 'roles',
  timestamps: true
});

module.exports = Rol;
