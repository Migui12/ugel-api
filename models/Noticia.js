  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/database');

  const Noticia = sequelize.define('Noticia', {
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
    resumen: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoria: {
      type: DataTypes.ENUM('INSTITUCIONAL', 'ACADEMICO', 'CULTURAL', 'DEPORTIVO', 'SOCIAL', 'LOGRO'),
      defaultValue: 'INSTITUCIONAL'
    },
    estado: {
      type: DataTypes.ENUM('BORRADOR', 'PUBLICADO', 'ARCHIVADO'),
      defaultValue: 'BORRADOR'
    },
    destacada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imagenUrl: {
      type: DataTypes.STRING(500)
    },
    imagenNombre: {
      type: DataTypes.STRING(255)
    },
    etiquetas: {
      type: DataTypes.STRING(500) // CSV: "educación,logro,regional"
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
    tableName: 'noticias',
    timestamps: true
  });

  module.exports = Noticia;
