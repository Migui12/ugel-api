// controllers/documentoController.js
const { Documento, Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

// GET /api/documentos (público)
const listar = async (req, res, next) => {
  try {
    const { categoria, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = { activo: true };
    if (categoria) where.categoria = categoria;

    const { count, rows } = await Documento.findAndCountAll({
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

// GET /api/documentos/:id/descargar (público)
const descargar = async (req, res, next) => {
  try {
    const documento = await Documento.findOne({
      where: { id: req.params.id, activo: true }
    });

    if (!documento) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    const filePath = path.join(__dirname, '..', documento.archivoUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Archivo no disponible' });
    }

    // Incrementar descargas
    await documento.increment('descargas');

    res.download(filePath, documento.archivoNombre);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/documentos
const listarAdmin = async (req, res, next) => {
  try {
    const { categoria, pagina = 1, limite = 20 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};
    if (categoria) where.categoria = categoria;

    const { count, rows } = await Documento.findAndCountAll({
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

// POST /api/admin/documentos
const crear = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'El archivo es requerido' });
    }

    const documento = await Documento.create({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria || 'OTRO',
      archivoUrl: `/uploads/documents/${req.file.filename}`,
      archivoNombre: req.file.originalname,
      archivoTamanio: req.file.size,
      autorId: req.user.id
    });

    res.status(201).json({ success: true, message: 'Documento creado', data: documento });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/documentos/:id
const actualizar = async (req, res, next) => {
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    const datos = {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      categoria: req.body.categoria,
      activo: req.body.activo !== undefined ? req.body.activo === 'true' || req.body.activo === true : documento.activo
    };

    if (req.file) {
      // Eliminar archivo anterior
      const oldPath = path.join(__dirname, '..', documento.archivoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      datos.archivoUrl = `/uploads/documents/${req.file.filename}`;
      datos.archivoNombre = req.file.originalname;
      datos.archivoTamanio = req.file.size;
    }

    await documento.update(datos);
    res.json({ success: true, message: 'Documento actualizado', data: documento });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/documentos/:id
const eliminar = async (req, res, next) => {
  try {
    const documento = await Documento.findByPk(req.params.id);
    if (!documento) {
      return res.status(404).json({ success: false, message: 'Documento no encontrado' });
    }

    const filePath = path.join(__dirname, '..', documento.archivoUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await documento.destroy();
    res.json({ success: true, message: 'Documento eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listar, descargar, listarAdmin, crear, actualizar, eliminar };
