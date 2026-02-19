// models/Tramite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tramite = sequelize.define('Tramite', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  numeroExpediente: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING(8),
    allowNull: false,
    validate: {
      len: [8, 8],
      isNumeric: true
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { isEmail: true }
  },
  telefono: {
    type: DataTypes.STRING(15)
  },
  tipoTramite: {
    type: DataTypes.ENUM(
      'CONTRATACION_DOCENTE', 'LICENCIA', 'PERMISO', 'REASIGNACION',
      'PERMUTA', 'CESE', 'REINCORPORACION', 'PAGO_HABERES',
      'ESCALAFON', 'RECONOCIMIENTO', 'SUBSANACION', 'APELACION', 'OTRO'
    ),
    allowNull: false
  },
  asunto: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  archivoUrl: {
    type: DataTypes.STRING(500)
  },
  archivoNombre: {
    type: DataTypes.STRING(255)
  },
  archivoTamanio: {
    type: DataTypes.INTEGER
  },
  estado: {
    type: DataTypes.ENUM('RECIBIDO', 'EN_PROCESO', 'ATENDIDO', 'RECHAZADO'),
    defaultValue: 'RECIBIDO'
  },
  observaciones: {
    type: DataTypes.TEXT
  },
  operadorId: {
    type: DataTypes.INTEGER.UNSIGNED
  },
  fechaAtencion: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'tramites',
  timestamps: true
});

module.exports = Tramite;
