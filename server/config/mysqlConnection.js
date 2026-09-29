/**
 * GoDaddy Hosted MySQL Database Driver & Connection Manager
 * Utilizes official 'mysql2/promise' driver with environment variables:
 * - DB_HOST
 * - DB_PORT (defaults to 3306)
 * - DB_USER
 * - DB_PASSWORD
 * - DB_NAME
 */
const mysql = require('mysql2/promise');
require('../utils/dbEnv');

/**
 * Resolves database connection configuration parameters from GoDaddy environment variables
 */
function getDbConfig() {
  const isSslRequired = process.env.DB_SSL === 'true' || 
                        process.env.MYSQL_SSL === 'true' || 
                        process.env.DB_SSL_MODE === 'REQUIRED' || 
                        process.env.SSL_MODE === 'REQUIRED' ||
                        (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require'));
  const sslConfig = isSslRequired ? { rejectUnauthorized: false } : undefined;

  if (process.env.DB_HOST && process.env.DB_NAME) {
    return {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
      ...(sslConfig && { ssl: sslConfig })
    };
  }

  // Fallback parser if DATABASE_URL is present
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const isSsl = url.searchParams.get('ssl-mode') || url.searchParams.get('sslmode') || isSslRequired;
      return {
        host: url.hostname,
        port: Number(url.port || '3306'),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        charset: 'utf8mb4'
      };
    } catch (_) {}
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    ...(sslConfig && { ssl: sslConfig })
  };
}

/**
 * Open a short-lived MySQL connection to GoDaddy hosted database
 * As specified in GoDaddy database integration docs:
 * 
 * const connection = await mysql.createConnection({
 *   host: process.env.DB_HOST,
 *   port: Number(process.env.DB_PORT || '3306'),
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 *   database: process.env.DB_NAME
 * });
 */
async function createConnection(overrides = {}) {
  const config = {
    ...getDbConfig(),
    ...overrides
  };
  return await mysql.createConnection(config);
}

/**
 * Connection pool for high-throughput queries
 */
let pool = null;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...getDbConfig(),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

/**
 * Executes a callback with a short-lived connection, guaranteeing
 * proper connection closure in a finally block.
 * 
 * @param {Function} callback - Async function taking (connection)
 * @returns {Promise<any>}
 */
async function withConnection(callback) {
  const connection = await createConnection();
  try {
    return await callback(connection);
  } finally {
    if (connection && typeof connection.end === 'function') {
      await connection.end();
    }
  }
}

/**
 * Execute raw SQL query with automatic short-lived connection management
 */
async function executeQuery(sql, params = []) {
  return await withConnection(async (conn) => {
    const [results, fields] = await conn.execute(sql, params);
    return results;
  });
}

module.exports = {
  mysql,
  createConnection,
  getDbConfig,
  getPool,
  withConnection,
  executeQuery
};
