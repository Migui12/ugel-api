const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/configuracionController');

router.get('/', ctrl.obtener);

module.exports = router;