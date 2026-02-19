// models/Documento.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Documento = sequelize.define('Documento', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(500)
  },
  categoria: {
    type: DataTypes.ENUM('DIRECTIVA', 'RESOLUCION', 'OFICIO', 'MEMORANDO', 'INFORME', 'FORMATO', 'OTRO'),
    defaultValue: 'OTRO'
  },
  archivoUrl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  archivoNombre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  archivoTamanio: {
    type: DataTypes.INTEGER
  },
  descargas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  autorId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  tableName: 'documentos',
  timestamps: true
});

module.exports = Documento;
