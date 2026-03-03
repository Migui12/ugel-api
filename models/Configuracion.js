const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuracion = sequelize.define('Configuracion', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true }
  },
  telefono: {
    type: DataTypes.STRING(12),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  atencion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dia_inicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  dia_fin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  hora_inicio: {
    type: DataTypes.STRING(5),
    allowNull: false,
    defaultValue: '08:00'
  },
  hora_fin: {
    type: DataTypes.STRING(5),
    allowNull: false,
    defaultValue: '17:00'
  },

  imagen: {
    type: DataTypes.STRING(500)
  },
}, {
  tableName: 'configuracion',
  timestamps: false
});

module.exports = Configuracion;