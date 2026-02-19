// models/Comunicado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comunicado = sequelize.define('Comunicado', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: { notEmpty: true }
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  resumen: {
    type: DataTypes.STRING(500)
  },
  categoria: {
    type: DataTypes.ENUM('GENERAL', 'ACADEMICO', 'ADMINISTRATIVO', 'URGENTE'),
    defaultValue: 'GENERAL'
  },
  estado: {
    type: DataTypes.ENUM('BORRADOR', 'PUBLICADO', 'ARCHIVADO'),
    defaultValue: 'BORRADOR'
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  archivoUrl: {
    type: DataTypes.STRING(500)
  },
  archivoNombre: {
    type: DataTypes.STRING(255)
  },
  vistas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  autorId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  fechaPublicacion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'comunicados',
  timestamps: true
});

module.exports = Comunicado;
