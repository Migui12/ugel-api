// controllers/convocatoriaController.js
const { Op } = require('sequelize');
const { Convocatoria, Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

// GET /api/convocatorias (público)
const listar = async (req, res, next) => {
  try {
    const { tipo, estado, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};

    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;

    const { count, rows } = await Convocatoria.findAndCountAll({
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

// GET /api/convocatorias/:id (público)
const obtener = async (req, res, next) => {
  try {
    const convocatoria = await Convocatoria.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido'] }]
    });

    if (!convocatoria) {
      return res.status(404).json({ success: false, message: 'Convocatoria no encontrada' });
    }

    res.json({ success: true, data: convocatoria });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/convocatorias (admin)
const listarAdmin = async (req, res, next) => {
  try {
    const { tipo, estado, pagina = 1, limite = 10 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;

    const { count, rows } = await Convocatoria.findAndCountAll({
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

// POST /api/admin/convocatorias
const crear = async (req, res, next) => {
  try {
    const datos = {
      ...req.body,
      autorId: req.user.id,
      plazas: parseInt(req.body.plazas) || 1
    };

    // Manejar archivos (multer envía múltiples con fields)
    if (req.files) {
      if (req.files.archivo) {
        datos.archivoUrl = `/uploads/documents/${req.files.archivo[0].filename}`;
        datos.archivoNombre = req.files.archivo[0].originalname;
      }
      if (req.files.base) {
        datos.baseUrl = `/uploads/documents/${req.files.base[0].filename}`;
        datos.baseNombre = req.files.base[0].originalname;
      }
    }

    const convocatoria = await Convocatoria.create(datos);
    res.status(201).json({ success: true, message: 'Convocatoria creada', data: convocatoria });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/convocatorias/:id
const actualizar = async (req, res, next) => {
  try {
    const convocatoria = await Convocatoria.findByPk(req.params.id);
    if (!convocatoria) {
      return res.status(404).json({ success: false, message: 'Convocatoria no encontrada' });
    }

    const datos = { ...req.body, plazas: parseInt(req.body.plazas) || convocatoria.plazas };

    if (req.files) {
      if (req.files.archivo) {
        datos.archivoUrl = `/uploads/documents/${req.files.archivo[0].filename}`;
        datos.archivoNombre = req.files.archivo[0].originalname;
      }
      if (req.files.base) {
        datos.baseUrl = `/uploads/documents/${req.files.base[0].filename}`;
        datos.baseNombre = req.files.base[0].originalname;
      }
    }

    await convocatoria.update(datos);
    res.json({ success: true, message: 'Convocatoria actualizada', data: convocatoria });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/convocatorias/:id
const eliminar = async (req, res, next) => {
  try {
    const convocatoria = await Convocatoria.findByPk(req.params.id);
    if (!convocatoria) {
      return res.status(404).json({ success: false, message: 'Convocatoria no encontrada' });
    }
    await convocatoria.destroy();
    res.json({ success: true, message: 'Convocatoria eliminada' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, obtener, listarAdmin, crear, actualizar, eliminar };
