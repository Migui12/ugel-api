-- ============================================================
-- SCRIPT SQL COMPLETO - SISTEMA UGEL
-- Base de datos: ugel_db
-- Autor: Sistema UGEL Perú
-- Versión: 1.0.0
-- ============================================================

-- Crear y seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS ugel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ugel_db;

-- ============================================================
-- TABLA: roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(200),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  dni VARCHAR(8),
  telefono VARCHAR(15),
  activo BOOLEAN DEFAULT TRUE,
  rolId INT UNSIGNED NOT NULL,
  ultimoAcceso DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rolId) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_email (email),
  INDEX idx_rolId (rolId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: comunicados
-- ============================================================
CREATE TABLE IF NOT EXISTS comunicados (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  contenido TEXT NOT NULL,
  resumen VARCHAR(500),
  categoria ENUM('GENERAL','ACADEMICO','ADMINISTRATIVO','URGENTE') DEFAULT 'GENERAL',
  estado ENUM('BORRADOR','PUBLICADO','ARCHIVADO') DEFAULT 'BORRADOR',
  destacado BOOLEAN DEFAULT FALSE,
  archivoUrl VARCHAR(500),
  archivoNombre VARCHAR(255),
  vistas INT DEFAULT 0,
  autorId INT UNSIGNED NOT NULL,
  fechaPublicacion DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (autorId) REFERENCES usuarios(id) ON DELETE RESTRICT,
  INDEX idx_estado (estado),
  INDEX idx_categoria (categoria),
  INDEX idx_fechaPublicacion (fechaPublicacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: convocatorias
-- ============================================================
CREATE TABLE IF NOT EXISTS convocatorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo ENUM('DOCENTE','ADMINISTRATIVO','CAS','DIRECTIVO','AUXILIAR','OTRO') NOT NULL,
  estado ENUM('PROXIMA','ABIERTA','CERRADA','DESIERTA','CONCLUIDA') DEFAULT 'PROXIMA',
  plazas INT DEFAULT 1,
  requisitos TEXT,
  beneficios TEXT,
  archivoUrl VARCHAR(500),
  archivoNombre VARCHAR(255),
  baseUrl VARCHAR(500),
  baseNombre VARCHAR(255),
  fechaInicio DATE,
  fechaFin DATE,
  fechaResultados DATE,
  autorId INT UNSIGNED NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (autorId) REFERENCES usuarios(id) ON DELETE RESTRICT,
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado),
  INDEX idx_fechaInicio (fechaInicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: tramites (Mesa de Partes Virtual)
-- ============================================================
CREATE TABLE IF NOT EXISTS tramites (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numeroExpediente VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  dni VARCHAR(8) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono VARCHAR(15),
  tipoTramite ENUM(
    'CONTRATACION_DOCENTE',
    'LICENCIA',
    'PERMISO',
    'REASIGNACION',
    'PERMUTA',
    'CESE',
    'REINCORPORACION',
    'PAGO_HABERES',
    'ESCALAFON',
    'RECONOCIMIENTO',
    'SUBSANACION',
    'APELACION',
    'OTRO'
  ) NOT NULL,
  asunto VARCHAR(500) NOT NULL,
  descripcion TEXT,
  archivoUrl VARCHAR(500),
  archivoNombre VARCHAR(255),
  archivoTamanio INT,
  estado ENUM('RECIBIDO','EN_PROCESO','ATENDIDO','RECHAZADO') DEFAULT 'RECIBIDO',
  observaciones TEXT,
  operadorId INT UNSIGNED,
  fechaAtencion DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (operadorId) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_numeroExpediente (numeroExpediente),
  INDEX idx_dni (dni),
  INDEX idx_estado (estado),
  INDEX idx_tipoTramite (tipoTramite)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: documentos
-- ============================================================
CREATE TABLE IF NOT EXISTS documentos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  descripcion VARCHAR(500),
  categoria ENUM('DIRECTIVA','RESOLUCION','OFICIO','MEMORANDO','INFORME','FORMATO','OTRO') DEFAULT 'OTRO',
  archivoUrl VARCHAR(500) NOT NULL,
  archivoNombre VARCHAR(255) NOT NULL,
  archivoTamanio INT,
  descargas INT DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  autorId INT UNSIGNED NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (autorId) REFERENCES usuarios(id) ON DELETE RESTRICT,
  INDEX idx_categoria (categoria),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Insertar roles
INSERT INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador con acceso total al sistema'),
('OPERADOR', 'Operador con acceso limitado a gestión de trámites y contenido');

-- Insertar usuario administrador
-- Password: Admin2024! (hash bcrypt)
INSERT INTO usuarios (nombre, apellido, email, password, dni, rolId) VALUES
(
  'Administrador',
  'UGEL',
  'admin@ugel.gob.pe',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBpj2ZBjRlNKXe',
  '00000001',
  1
);

-- Insertar operador de ejemplo
-- Password: Operador2024!
INSERT INTO usuarios (nombre, apellido, email, password, dni, rolId) VALUES
(
  'María',
  'García López',
  'operador@ugel.gob.pe',
  '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uxi/jPiWi',
  '12345678',
  2
);

-- Comunicados de ejemplo
INSERT INTO comunicados (titulo, contenido, resumen, categoria, estado, destacado, autorId, fechaPublicacion) VALUES
(
  'Inicio del Año Escolar 2024 - Medidas Organizativas',
  '<p>La Unidad de Gestión Educativa Local comunica a toda la comunidad educativa las disposiciones para el inicio del año escolar 2024. Se establecen las fechas de matrícula, distribución de materiales educativos y actividades de bienvenida.</p><p>Todos los directores deberán presentar sus informes de inicio hasta el 15 de marzo.</p>',
  'Disposiciones oficiales para el inicio del año escolar 2024 en todas las instituciones educativas de la jurisdicción.',
  'ACADEMICO',
  'PUBLICADO',
  TRUE,
  1,
  NOW()
),
(
  'Cronograma de Contratación Docente - Segunda Convocatoria',
  '<p>Se comunica a todos los docentes interesados el cronograma oficial para la segunda convocatoria de contratación docente 2024. Los postulantes deberán presentar su documentación completa según el cronograma establecido.</p>',
  'Cronograma oficial para la segunda convocatoria de contratación docente del presente año.',
  'ADMINISTRATIVO',
  'PUBLICADO',
  FALSE,
  1,
  NOW()
),
(
  'Capacitación: Uso de la Plataforma Virtual PerúEduca',
  '<p>Se invita a todos los docentes a participar en la capacitación sobre el uso efectivo de la Plataforma Virtual PerúEduca. La capacitación se realizará de manera presencial y virtual.</p>',
  'Capacitación gratuita para docentes sobre herramientas digitales educativas.',
  'ACADEMICO',
  'PUBLICADO',
  FALSE,
  1,
  NOW()
);

-- Convocatorias de ejemplo
INSERT INTO convocatorias (titulo, descripcion, tipo, estado, plazas, requisitos, fechaInicio, fechaFin, autorId) VALUES
(
  'Contratación Docente - Nivel Primaria - Plaza 001',
  'Convocatoria para cubrir plaza vacante de docente de nivel primaria en la I.E. N° 20568 del distrito de San Marcos.',
  'DOCENTE',
  'ABIERTA',
  1,
  '- Título pedagógico en Educación Primaria\n- Registro en el CPPe vigente\n- DNI vigente\n- No tener antecedentes penales ni judiciales',
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 15 DAY),
  1
),
(
  'Contratación Docente - Nivel Secundaria - Matemática',
  'Convocatoria para cubrir plaza vacante de docente de Matemática en nivel secundaria.',
  'DOCENTE',
  'PROXIMA',
  2,
  '- Título pedagógico en Matemática o afín\n- Registro en el CPPe\n- Experiencia mínima de 1 año',
  DATE_ADD(CURDATE(), INTERVAL 5 DAY),
  DATE_ADD(CURDATE(), INTERVAL 20 DAY),
  1
),
(
  'CAS - Especialista Administrativo',
  'Convocatoria CAS para Especialista Administrativo en la sede de la UGEL.',
  'CAS',
  'CERRADA',
  1,
  '- Título universitario en Administración o afín\n- Experiencia mínima 2 años en sector público\n- Conocimientos en SIAF y SIGA',
  DATE_ADD(CURDATE(), INTERVAL -30 DAY),
  DATE_ADD(CURDATE(), INTERVAL -15 DAY),
  1
);

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SELECT 'Base de datos UGEL creada exitosamente' AS mensaje;
SELECT COUNT(*) AS total_tablas FROM information_schema.tables WHERE table_schema = 'ugel_db';
