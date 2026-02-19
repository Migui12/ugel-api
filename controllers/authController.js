// controllers/authController.js
// Controlador de autenticación

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

/**
 * POST /api/auth/login
 * Autenticar usuario y generar token JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario con password (scope especial)
    const usuario = await Usuario.scope('withPassword').findOne({
      where: { email: email.toLowerCase().trim(), activo: true },
      include: [{ model: Rol, as: 'rol' }]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }

    // Actualizar último acceso
    await usuario.update({ ultimoAcceso: new Date() });

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Responder sin el password
    const userResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol.nombre
    };

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      usuario: userResponse
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Obtener datos del usuario autenticado
 */
const getMe = async (req, res) => {
  res.json({
    success: true,
    usuario: {
      id: req.user.id,
      nombre: req.user.nombre,
      apellido: req.user.apellido,
      email: req.user.email,
      rol: req.user.rol?.nombre,
      ultimoAcceso: req.user.ultimoAcceso
    }
  });
};

/**
 * POST /api/auth/cambiar-password
 * Cambiar contraseña del usuario autenticado
 */
const cambiarPassword = async (req, res, next) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren ambas contraseñas'
      });
    }

    if (passwordNuevo.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 8 caracteres'
      });
    }

    // Buscar usuario con password
    const usuario = await Usuario.scope('withPassword').findByPk(req.user.id);
    const passwordValida = await bcrypt.compare(passwordActual, usuario.password);

    if (!passwordValida) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(passwordNuevo, rounds);
    await usuario.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, cambiarPassword };
