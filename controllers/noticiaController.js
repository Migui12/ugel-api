const { Noticia, Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

// GET /api/noticias (público)
const listar = async (req, res, next) => {
  try {
    const { categoria, destacada, pagina = 1, limite = 9 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = { estado: 'PUBLICADO' };
    if (categoria) where.categoria = categoria;
    if (destacada !== undefined) where.destacada = destacada === 'true';

    const { count, rows } = await Noticia.findAndCountAll({
      where,
      include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido'] }],
      order: [['destacada', 'DESC'], ['fechaPublicacion', 'DESC']],
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
  } catch (error) { next(error); }
};

// GET /api/noticias/:id (público)
const obtener = async (req, res, next) => {
  try {
    const noticia = await Noticia.findOne({
      where: { id: req.params.id, estado: 'PUBLICADO' },
      include: [{ model: Usuario, as: 'autor', attributes: ['nombre', 'apellido'] }]
    });

    if (!noticia) return res.status(404).json({ success: false, message: 'Noticia no encontrada' });

    await noticia.increment('vistas');
    res.json({ success: true, data: noticia });
  } catch (error) { next(error); }
};

// GET /api/admin/noticias (admin)
const listarAdmin = async (req, res, next) => {
  try {
    const { estado, categoria, pagina = 1, limite = 15 } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};
    if (estado) where.estado = estado;
    if (categoria) where.categoria = categoria;

    const { count, rows } = await Noticia.findAndCountAll({
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
  } catch (error) { next(error); }
};

// POST /api/admin/noticias
const crear = async (req, res, next) => {
  try {
    const { titulo, resumen, contenido, categoria, estado, destacada, etiquetas } = req.body;

    if (!titulo || !resumen || !contenido) {
      return res.status(400).json({ success: false, message: 'Título, resumen y contenido son requeridos' });
    }

    const datos = {
      titulo, resumen, contenido,
      categoria: categoria || 'INSTITUCIONAL',
      estado: estado || 'BORRADOR',
      destacada: destacada === 'true' || destacada === true,
      etiquetas: etiquetas || '',
      autorId: req.user.id
    };

    if (estado === 'PUBLICADO') datos.fechaPublicacion = new Date();

    if (req.file) {
      datos.imagenUrl = `${process.env.BASE_URL}/uploads/noticias/${req.file.filename}`;
      datos.imagenNombre = req.file.originalname;
    }

    const noticia = await Noticia.create(datos);
    res.status(201).json({ success: true, message: 'Noticia creada', data: noticia });
  } catch (error) { next(error); }
};

// PUT /api/admin/noticias/:id
const actualizar = async (req, res, next) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ success: false, message: 'Noticia no encontrada' });

    const datos = { ...req.body };
    datos.destacada = datos.destacada === 'true' || datos.destacada === true;
    if (datos.estado === 'PUBLICADO' && noticia.estado !== 'PUBLICADO') {
      datos.fechaPublicacion = new Date();
    }

    if (req.file) {
      // Eliminar imagen anterior si existe
      if (noticia.imagenUrl) {
        const oldPath = path.join(__dirname, '..', noticia.imagenUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      datos.imagenUrl = `${process.env.BASE_URL}/uploads/noticias/${req.file.filename}`;
      datos.imagenNombre = req.file.originalname;
    }

    await noticia.update(datos);
    res.json({ success: true, message: 'Noticia actualizada', data: noticia });
  } catch (error) { next(error); }
};

// DELETE /api/admin/noticias/:id
const eliminar = async (req, res, next) => {
  try {
    const noticia = await Noticia.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ success: false, message: 'Noticia no encontrada' });

    if (noticia.imagenUrl) {
      const filePath = path.join(__dirname, '..', noticia.imagenUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await noticia.destroy();
    res.json({ success: true, message: 'Noticia eliminada' });
  } catch (error) { next(error); }
};

module.exports = { listar, obtener, listarAdmin, crear, actualizar, eliminar };
