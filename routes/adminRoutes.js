// routes/adminRoutes.js
// Todas las rutas aquí requieren autenticación

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { uploadDocument, handleMulterError } = require('../middleware/upload');
const multer = require('multer');

const comunicadoCtrl = require('../controllers/comunicadoController');
const convocatoriaCtrl = require('../controllers/convocatoriaController');
const tramiteCtrl = require('../controllers/tramiteController');
const documentoCtrl = require('../controllers/documentoController');
const usuarioCtrl = require('../controllers/usuarioController');

// Aplicar autenticación a todas las rutas admin
router.use(authenticate);

// ============================================================
// COMUNICADOS ADMIN
// ============================================================
router.get('/comunicados', comunicadoCtrl.listarAdmin);
router.post('/comunicados', uploadDocument.single('archivo'), handleMulterError, comunicadoCtrl.crear);
router.put('/comunicados/:id', uploadDocument.single('archivo'), handleMulterError, comunicadoCtrl.actualizar);
router.delete('/comunicados/:id', authorize('ADMIN'), comunicadoCtrl.eliminar);

// ============================================================
// CONVOCATORIAS ADMIN
// ============================================================
const uploadFields = uploadDocument.fields([
  { name: 'archivo', maxCount: 1 },
  { name: 'base', maxCount: 1 }
]);

router.get('/convocatorias', convocatoriaCtrl.listarAdmin);
router.post('/convocatorias', uploadFields, handleMulterError, convocatoriaCtrl.crear);
router.put('/convocatorias/:id', uploadFields, handleMulterError, convocatoriaCtrl.actualizar);
router.delete('/convocatorias/:id', authorize('ADMIN'), convocatoriaCtrl.eliminar);

// ============================================================
// TRÁMITES ADMIN
// ============================================================
router.get('/tramites/estadisticas', tramiteCtrl.estadisticas);
router.get('/tramites', tramiteCtrl.listarAdmin);
router.get('/tramites/:id', tramiteCtrl.obtenerAdmin);
router.patch('/tramites/:id/estado', tramiteCtrl.cambiarEstado);

// ============================================================
// DOCUMENTOS ADMIN
// ============================================================
router.get('/documentos', documentoCtrl.listarAdmin);
router.post('/documentos', uploadDocument.single('archivo'), handleMulterError, documentoCtrl.crear);
router.put('/documentos/:id', uploadDocument.single('archivo'), handleMulterError, documentoCtrl.actualizar);
router.delete('/documentos/:id', authorize('ADMIN'), documentoCtrl.eliminar);

// ============================================================
// USUARIOS ADMIN (solo ADMIN)
// ============================================================
router.get('/usuarios', authorize('ADMIN'), usuarioCtrl.listar);
router.post('/usuarios', authorize('ADMIN'), usuarioCtrl.crear);
router.put('/usuarios/:id', authorize('ADMIN'), usuarioCtrl.actualizar);
router.delete('/usuarios/:id', authorize('ADMIN'), usuarioCtrl.eliminar);

module.exports = router;
