// routes/documentoRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/documentoController');

router.get('/', ctrl.listar);
router.get('/:id/descargar', ctrl.descargar);

module.exports = router;
