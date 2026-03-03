const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tramiteController');
const { uploadTramite, handleMulterError } = require('../middleware/upload');

// Rutas públicas
router.post('/', uploadTramite.single('archivo'), handleMulterError, ctrl.registrar);
router.get('/consultar/:codigo', ctrl.consultarPorCodigo);

module.exports = router;
