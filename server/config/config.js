/**
 * PUERTO DE LA APLICACION
 */

// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3001;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento del TOKEN
// ============================

process.env.TIEMPO_TOKEN = 60 * 60 * 24 * 30;

/**
 * SEED de Autenticacion
 */

process.env.SEED = process.env.SEED || 'desarrollo'

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;