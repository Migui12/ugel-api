const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/comunicados', require('./comunicadoRoutes'));
router.use('/convocatorias', require('./convocatoriaRoutes'));
router.use('/tramites', require('./tramiteRoutes'));
router.use('/documentos', require('./documentoRoutes'));
router.use('/noticias', require('./noticiaRoutes'));
router.use('/configuracion', require('./configuracionRoute'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
