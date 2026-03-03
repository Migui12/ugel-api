// Punto de entrada para todos los modelos Sequelize

const sequelize = require('../config/database');
const Rol = require('./Rol');
const Usuario = require('./Usuario');
const Comunicado = require('./Comunicado');
const Convocatoria = require('./Convocatoria');
const Tramite = require('./Tramite');
const Documento = require('./Documento');
const Noticia = require('./Noticia');
const Configuracion = require('./Configuracion');

// ============================================================
// ASOCIACIONES
// ============================================================

// Un Rol tiene muchos Usuarios
Rol.hasMany(Usuario, { foreignKey: 'rolId', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });

// Un Usuario crea muchos Comunicados
Usuario.hasMany(Comunicado, { foreignKey: 'autorId', as: 'comunicados' });
Comunicado.belongsTo(Usuario, { foreignKey: 'autorId', as: 'autor' });

// Un Usuario crea muchas Convocatorias
Usuario.hasMany(Convocatoria, { foreignKey: 'autorId', as: 'convocatorias' });
Convocatoria.belongsTo(Usuario, { foreignKey: 'autorId', as: 'autor' });

// Un Usuario atiende muchos Trámites
Usuario.hasMany(Tramite, { foreignKey: 'operadorId', as: 'tramitesAtendidos' });
Tramite.belongsTo(Usuario, { foreignKey: 'operadorId', as: 'operador' });

// Un Usuario sube muchos Documentos
Usuario.hasMany(Documento, { foreignKey: 'autorId', as: 'documentos' });
Documento.belongsTo(Usuario, { foreignKey: 'autorId', as: 'autor' });

// Un Usuario crea muchas Noticias
Usuario.hasMany(Noticia, { foreignKey: 'autorId', as: 'noticias' });
Noticia.belongsTo(Usuario, { foreignKey: 'autorId', as: 'autor' });

module.exports = {
  sequelize,
  Rol,
  Usuario,
  Comunicado,
  Convocatoria,
  Tramite,
  Documento,
  Noticia,
  Configuracion,
};
