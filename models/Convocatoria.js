// models/Convocatoria.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Convocatoria = sequelize.define('Convocatoria', {
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
    type: DataTypes.TEXT,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('DOCENTE', 'ADMINISTRATIVO', 'CAS', 'DIRECTIVO', 'AUXILIAR', 'OTRO'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PROXIMA', 'ABIERTA', 'CERRADA', 'DESIERTA', 'CONCLUIDA'),
    defaultValue: 'PROXIMA'
  },
  plazas: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  requisitos: {
    type: DataTypes.TEXT
  },
  beneficios: {
    type: DataTypes.TEXT
  },
  archivoUrl: {
    type: DataTypes.STRING(500)
  },
  archivoNombre: {
    type: DataTypes.STRING(255)
  },
  baseUrl: {
    type: DataTypes.STRING(500)
  },
  baseNombre: {
    type: DataTypes.STRING(255)
  },
  fechaInicio: {
    type: DataTypes.DATEONLY
  },
  fechaFin: {
    type: DataTypes.DATEONLY
  },
  fechaResultados: {
    type: DataTypes.DATEONLY
  },
  autorId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  }
}, {
  tableName: 'convocatorias',
  timestamps: true
});

module.exports = Convocatoria;
