/**
 * Database Environment Helper for GoDaddy & Cloud Hosting
 * Automatically constructs standard DATABASE_URL when DB_HOST, DB_USER, etc. are provided
 */
require('dotenv').config();

function initDbEnv() {
  if (process.env.DB_HOST && process.env.DB_NAME) {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT || 3306;
    const user = encodeURIComponent(process.env.DB_USER || 'root');
    const pass = encodeURIComponent(process.env.DB_PASSWORD || '');
    const name = process.env.DB_NAME || '';
    // Construct standard MySQL connection string for Prisma
    process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${name}`;
    console.log(`[Database Config] Synthesized DATABASE_URL from GoDaddy environment: mysql://${user}:***@${host}:${port}/${name}`);
  }
}

initDbEnv();

module.exports = { initDbEnv };
