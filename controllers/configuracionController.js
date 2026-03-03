const { Configuracion, Usuario } = require('../models');
const fs = require('fs');
const path = require('path');

// GET /api/configuración (configuración de la página)
const obtener = async (req, res, next) => {
  try {

    const configuracion = await Configuracion.findOne();

    if (!configuracion) {
        return res.status(404).json({
            success: false,
            message: 'Configuración no encontrada'
        });
    }

    res.json({ success: true, data: configuracion });
  } catch (error) { next(error); }
};

// PUT /api/admin/configuracion/:id
const actualizar = async (req, res, next) => {
  try {
    const configuracion = await Configuracion.findByPk(req.params.id);

    const datos = { ...req.body };

    if (req.file) {
      // Eliminar imagen anterior si existe
      if (configuracion.imagen) {
        const oldPath = path.join(__dirname, '..', configuracion.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      datos.imagen = `/uploads/configuracion/${req.file.filename}`;
    }

    await configuracion.update(datos);
    res.json({ success: true, message: 'Actualizado', data: configuracion });
  } catch (error) { next(error); }
};

module.exports = { obtener, actualizar};
