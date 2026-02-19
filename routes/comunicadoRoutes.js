// routes/comunicadoRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/comunicadoController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

module.exports = router;
