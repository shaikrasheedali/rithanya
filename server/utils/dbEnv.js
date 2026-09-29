/**
 * Database Environment Helper for GoDaddy Hosted MySQL
 * Automatically maps GoDaddy environment variables:
 * - DB_HOST
 * - DB_PORT
 * - DB_NAME
 * - DB_USER
 * - DB_PASSWORD
 * into Prisma-compatible and mysql2-compatible configurations.
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
    process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${name}?connection_limit=10&connect_timeout=30&pool_timeout=60`;
    console.log(`[Database Config] ✓ Configured GoDaddy Hosted MySQL: mysql://${user}:***@${host}:${port}/${name}`);
  }
}

initDbEnv();

module.exports = { initDbEnv };
