// routes/convocatoriaRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/convocatoriaController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

module.exports = router;
