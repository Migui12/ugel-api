// controllers/tramiteController.js
const { Tramite, Usuario } = require('../models');
const { Op } = require('sequelize');

// Generar número de expediente único: UGEL-AÑO-NNNNNN
const generarNumeroExpediente = async () => {
  const año = new Date().getFullYear();
  const prefix = `UGEL-${año}-`;

  // Buscar el último expediente del año
  const ultimo = await Tramite.findOne({
    where: {
      numeroExpediente: { [Op.like]: `${prefix}%` }
    },
    order: [['createdAt', 'DESC']]
  });

  let secuencia = 1;
  if (ultimo) {
    const partes = ultimo.numeroExpediente.split('-');
    secuencia = parseInt(partes[partes.length - 1]) + 1;
  }

  return `${prefix}${String(secuencia).padStart(6, '0')}`;
};

// POST /api/tramites - Registrar nuevo trámite (público)
const registrar = async (req, res, next) => {
  try {
    const {
      nombre, apellido, dni, email, telefono,
      tipoTramite, asunto, descripcion
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !dni || !email || !tipoTramite || !asunto) {
      return res.status(400).json({
        success: false,
        message: 'Los campos nombre, apellido, DNI, email, tipo de trámite y asunto son requeridos'
      });
    }

    if (!/^\d{8}$/.test(dni)) {
      return res.status(400).json({
        success: false,
        message: 'El DNI debe tener exactamente 8 dígitos numéricos'
      });
    }

    const numeroExpediente = await generarNumeroExpediente();

    const datos = {
      numeroExpediente,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni,
      email: email.toLowerCase().trim(),
      telefono,
      tipoTramite,
      asunto: asunto.trim(),
      descripcion,
      estado: 'RECIBIDO'
    };

    if (req.file) {
      datos.archivoUrl = `/uploads/tramites/${req.file.filename}`;
      datos.archivoNombre = req.file.originalname;
      datos.archivoTamanio = req.file.size;
    }

    const tramite = await Tramite.create(datos);

    res.status(201).json({
      success: true,
      message: 'Trámite registrado exitosamente',
      data: {
        numeroExpediente: tramite.numeroExpediente,
        estado: tramite.estado,
        fechaRegistro: tramite.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tramites/consultar/:codigo (público)
const consultarPorCodigo = async (req, res, next) => {
  try {
    const { codigo } = req.params;

    const tramite = await Tramite.findOne({
      where: { numeroExpediente: codigo.toUpperCase() },
      attributes: [
        'numeroExpediente', 'nombre', 'apellido', 'tipoTramite',
        'asunto', 'estado', 'observaciones', 'fechaAtencion', 'createdAt', 'updatedAt'
      ]
    });

    if (!tramite) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró ningún expediente con ese código'
      });
    }

    res.json({ success: true, data: tramite });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/tramites (admin)
const listarAdmin = async (req, res, next) => {
  try {
    const { estado, tipoTramite, pagina = 1, limite = 20, busqueda } = req.query;
    const offset = (pagina - 1) * limite;
    const where = {};

    if (estado) where.estado = estado;
    if (tipoTramite) where.tipoTramite = tipoTramite;
    if (busqueda) {
      where[Op.or] = [
        { numeroExpediente: { [Op.like]: `%${busqueda}%` } },
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { apellido: { [Op.like]: `%${busqueda}%` } },
        { dni: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    const { count, rows } = await Tramite.findAndCountAll({
      where,
      include: [{
        model: Usuario,
        as: 'operador',
        attributes: ['nombre', 'apellido'],
        required: false
      }],
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

// GET /api/admin/tramites/:id (admin)
const obtenerAdmin = async (req, res, next) => {
  try {
    const tramite = await Tramite.findByPk(req.params.id, {
      include: [{ model: Usuario, as: 'operador', attributes: ['nombre', 'apellido'] }]
    });

    if (!tramite) {
      return res.status(404).json({ success: false, message: 'Trámite no encontrado' });
    }

    res.json({ success: true, data: tramite });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/tramites/:id/estado
const cambiarEstado = async (req, res, next) => {
  try {
    const { estado, observaciones } = req.body;
    const estadosValidos = ['RECIBIDO', 'EN_PROCESO', 'ATENDIDO', 'RECHAZADO'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    const tramite = await Tramite.findByPk(req.params.id);
    if (!tramite) {
      return res.status(404).json({ success: false, message: 'Trámite no encontrado' });
    }

    const datos = { estado, operadorId: req.user.id };
    if (observaciones) datos.observaciones = observaciones;
    if (estado === 'ATENDIDO' || estado === 'RECHAZADO') {
      datos.fechaAtencion = new Date();
    }

    await tramite.update(datos);
    res.json({ success: true, message: 'Estado actualizado', data: tramite });
  } catch (error) {
    next(error);
  }
};

// Estadísticas para dashboard
const estadisticas = async (req, res, next) => {
  try {
    const { sequelize } = require('../models');
    const stats = await Tramite.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      group: ['estado']
    });

    const resumen = {
      RECIBIDO: 0, EN_PROCESO: 0, ATENDIDO: 0, RECHAZADO: 0, total: 0
    };

    stats.forEach(s => {
      resumen[s.estado] = parseInt(s.dataValues.total);
      resumen.total += parseInt(s.dataValues.total);
    });

    res.json({ success: true, data: resumen });
  } catch (error) {
    next(error);
  }
};

module.exports = { registrar, consultarPorCodigo, listarAdmin, obtenerAdmin, cambiarEstado, estadisticas };
