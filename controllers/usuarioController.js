// controllers/usuarioController.js
const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');

// GET /api/admin/usuarios
const listar = async (req, res, next) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Rol, as: 'rol' }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: usuarios });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/usuarios
const crear = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, dni, telefono, rolId } = req.body;

    if (!nombre || !apellido || !email || !password || !rolId) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido, email, contraseña y rol son requeridos'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener mínimo 8 caracteres' });
    }

    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, rounds);

    const usuario = await Usuario.create({
      nombre, apellido,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      dni, telefono,
      rolId: parseInt(rolId)
    });

    const usuarioSinPassword = await Usuario.findByPk(usuario.id, {
      include: [{ model: Rol, as: 'rol' }]
    });

    res.status(201).json({ success: true, message: 'Usuario creado', data: usuarioSinPassword });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/usuarios/:id
const actualizar = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const { nombre, apellido, email, dni, telefono, rolId, activo, password } = req.body;
    const datos = { nombre, apellido, email, dni, telefono };
    if (rolId) datos.rolId = parseInt(rolId);
    if (activo !== undefined) datos.activo = activo === 'true' || activo === true;

    // Cambio de contraseña opcional
    if (password && password.length >= 8) {
      const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      datos.password = await bcrypt.hash(password, rounds);
    }

    await usuario.update(datos);
    const actualizado = await Usuario.findByPk(usuario.id, {
      include: [{ model: Rol, as: 'rol' }]
    });
    res.json({ success: true, message: 'Usuario actualizado', data: actualizado });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/usuarios/:id
const eliminar = async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'No puede eliminar su propio usuario' });
    }

    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, crear, actualizar, eliminar };
