// server.js
// Servidor principal de la API UGEL

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const { sequelize } = require('./models');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE DE SEGURIDAD
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Para servir archivos
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://uge-front-6pgy.vercel.app',
  /* origin: process.env.FRONTEND_URL || 'http://localhost:5173', */
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parseo de body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================================
// ARCHIVOS ESTÁTICOS
// Servir los archivos subidos de manera pública
// ============================================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// RUTAS DE LA API
// ============================================================
app.use('/api', routes);

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'UGEL API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ============================================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada`
  });
});

// ============================================================
// MIDDLEWARE GLOBAL DE ERRORES
// ============================================================
app.use(errorHandler);

// ============================================================
// INICIAR SERVIDOR
// ============================================================
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');

    // Sincronizar modelos (NO en producción, usar migraciones)
    if (process.env.NODE_ENV === 'development') {
      // alter: true actualiza tablas existentes sin borrar datos
      await sequelize.sync({ force: true });
      console.log('✅ Modelos sincronizados con la base de datos');
    }

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║         SISTEMA UGEL - API REST              ║
╠══════════════════════════════════════════════╣
║  Servidor: http://localhost:${PORT}           ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                ║
║  Base de datos: ${process.env.MYSQLDATABASE || process.env.DB_NAME}        ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
