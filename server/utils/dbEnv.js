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

    // Check for SSL/TLS transit encryption requirement
    const isSslRequired = process.env.DB_SSL === 'true' || 
                          process.env.MYSQL_SSL === 'true' || 
                          process.env.DB_SSL_MODE === 'REQUIRED' || 
                          process.env.SSL_MODE === 'REQUIRED' ||
                          (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require'));

    const sslParam = isSslRequired ? '&sslmode=require' : '';

    // Construct standard MySQL connection string for Prisma
    process.env.DATABASE_URL = `mysql://${user}:${pass}@${host}:${port}/${name}?connection_limit=10&connect_timeout=30&pool_timeout=60${sslParam}`;
    console.log(`[Database Config] ✓ Configured GoDaddy Hosted MySQL: mysql://${user}:***@${host}:${port}/${name}${isSslRequired ? ' (SSL/TLS Enabled)' : ''}`);
  }
}

initDbEnv();

module.exports = { initDbEnv };
