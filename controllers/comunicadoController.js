// controllers/comunicadoController.js
const { Op } = require('sequelize');
const { Comunicado, Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

// GET /api/comunicados (público) - Listar comunicados publicados
const listar = async (req, res, next) => {
  try {
    const { categoria, pagina = 1, limite = 10, destacado } = req.query;
    const offset = (pagina - 1) * limite;

    const where = { estado: 'PUBLICADO' };
    if (categoria) where.categoria = categoria;
    if (destacado !== undefined) where.destacado = destacado === 'true';

    const { count, rows } = await Comunicado.findAndCountAll({
      where,
      include: [{
        model: Usuario,
        as: 'autor',
        attributes: ['nombre', 'apellido']
      }],
      order: [['destacado', 'DESC'], ['fechaPublicacion', 'DESC']],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(count / limite)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/comunicados/:id (público)
const obtener = async (req, res, next) => {
  try {
    const comunicado = await Comunicado.findOne({
      where: { id: req.params.id, estado: 'PUBLICADO' },
      include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido'] }]
    });

    if (!comunicado) {
      return res.status(404).json({ success: false, message: 'Comunicado no encontrado' });
    }

    // Incrementar vistas
    await comunicado.increment('vistas');

    res.json({ success: true, data: comunicado });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/comunicados (admin) - Todos los comunicados
const listarAdmin = async (req, res, next) => {
  try {
    const { estado, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};
    if (estado) where.estado = estado;

    const { count, rows } = await Comunicado.findAndCountAll({
      where,
      include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, pagina: parseInt(pagina), limite: parseInt(limite), totalPaginas: Math.ceil(count / limite) }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/comunicados
const crear = async (req, res, next) => {
  try {
    const { titulo, contenido, resumen, categoria, estado, destacado } = req.body;

    const datos = {
      titulo,
      contenido,
      resumen,
      categoria: categoria || 'GENERAL',
      estado: estado || 'BORRADOR',
      destacado: destacado === 'true' || destacado === true,
      autorId: req.user.id
    };

    if (estado === 'PUBLICADO') {
      datos.fechaPublicacion = new Date();
    }

    if (req.file) {
      datos.archivoUrl = `/uploads/documents/${req.file.filename}`;
      datos.archivoNombre = req.file.originalname;
    }

    const comunicado = await Comunicado.create(datos);
    res.status(201).json({ success: true, message: 'Comunicado creado exitosamente', data: comunicado });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/comunicados/:id
const actualizar = async (req, res, next) => {
  try {
    const comunicado = await Comunicado.findByPk(req.params.id);
    if (!comunicado) {
      return res.status(404).json({ success: false, message: 'Comunicado no encontrado' });
    }

    const datos = { ...req.body };
    datos.destacado = datos.destacado === 'true' || datos.destacado === true;

    // Si se publica por primera vez, registrar fecha
    if (datos.estado === 'PUBLICADO' && comunicado.estado !== 'PUBLICADO') {
      datos.fechaPublicacion = new Date();
    }

    if (req.file) {
      // Eliminar archivo anterior si existe
      if (comunicado.archivoUrl) {
        const oldPath = path.join(__dirname, '..', comunicado.archivoUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      datos.archivoUrl = `/uploads/documents/${req.file.filename}`;
      datos.archivoNombre = req.file.originalname;
    }

    await comunicado.update(datos);
    res.json({ success: true, message: 'Comunicado actualizado', data: comunicado });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/comunicados/:id
const eliminar = async (req, res, next) => {
  try {
    const comunicado = await Comunicado.findByPk(req.params.id);
    if (!comunicado) {
      return res.status(404).json({ success: false, message: 'Comunicado no encontrado' });
    }

    // Eliminar archivo si existe
    if (comunicado.archivoUrl) {
      const filePath = path.join(__dirname, '..', comunicado.archivoUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await comunicado.destroy();
    res.json({ success: true, message: 'Comunicado eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, obtener, listarAdmin, crear, actualizar, eliminar };
