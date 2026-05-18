import "dotenv/config";

import pool from './config.js';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión exitosa a PostgreSQL');
    console.log('Hora del servidor de base de datos:', result.rows[0].now);
    await pool.end();
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
  }
}
testConnection();



