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
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada`
  });
});

app.use(errorHandler);

const startServer = async () => {
    app.listen(PORT, () => {
      console.log("El servidor funciona el puerto", PORT);
    });
};

startServer();
