// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING(8)
  },
  telefono: {
    type: DataTypes.STRING(15)
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rolId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  ultimoAcceso: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  // Excluir password en las consultas por defecto
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    }
  }
});

module.exports = Usuario;
