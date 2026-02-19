// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/comunicados', require('./comunicadoRoutes'));
router.use('/convocatorias', require('./convocatoriaRoutes'));
router.use('/tramites', require('./tramiteRoutes'));
router.use('/documentos', require('./documentoRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
