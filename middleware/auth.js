// middleware/auth.js
// Middleware de autenticación y autorización con JWT

const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

/**
 * Verifica el token JWT en el header Authorization
 * Adjunta el usuario autenticado a req.user
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Sesión expirada. Por favor, inicie sesión nuevamente.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findOne({
      where: { id: decoded.id, activo: true },
      include: [{ model: Rol, as: 'rol' }]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado o inactivo'
      });
    }

    // Adjuntar usuario a la request
    req.user = usuario;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 * Uso: authorize('ADMIN') o authorize('ADMIN', 'OPERADOR')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autenticado'
      });
    }

    const userRole = req.user.rol?.nombre;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
