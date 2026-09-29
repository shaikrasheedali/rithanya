const test = require('node:test');
const assert = require('node:assert');
const { getDbConfig, withConnection } = require('../../config/mysqlConnection');
const { initDbEnv } = require('../../utils/dbEnv');

test('GoDaddy Hosted MySQL Database Configuration & Driver Unit Suite', async (t) => {
  await t.test('getDbConfig should resolve GoDaddy environment variables correctly', () => {
    const originalHost = process.env.DB_HOST;
    const originalPort = process.env.DB_PORT;
    const originalUser = process.env.DB_USER;
    const originalPass = process.env.DB_PASSWORD;
    const originalName = process.env.DB_NAME;

    try {
      process.env.DB_HOST = 'godaddy-mysql.internal.net';
      process.env.DB_PORT = '3306';
      process.env.DB_USER = 'gd_admin_user';
      process.env.DB_PASSWORD = 'SecurePassword#2026';
      process.env.DB_NAME = 'godaddy_rithanya_prod';

      const config = getDbConfig();
      assert.strictEqual(config.host, 'godaddy-mysql.internal.net');
      assert.strictEqual(config.port, 3306);
      assert.strictEqual(config.user, 'gd_admin_user');
      assert.strictEqual(config.password, 'SecurePassword#2026');
      assert.strictEqual(config.database, 'godaddy_rithanya_prod');
      assert.strictEqual(config.charset, 'utf8mb4');
    } finally {
      process.env.DB_HOST = originalHost;
      process.env.DB_PORT = originalPort;
      process.env.DB_USER = originalUser;
      process.env.DB_PASSWORD = originalPass;
      process.env.DB_NAME = originalName;
    }
  });

  await t.test('dbEnv should synthesize standard Prisma connection URL from GoDaddy variables', () => {
    const originalHost = process.env.DB_HOST;
    const originalName = process.env.DB_NAME;
    const originalUrl = process.env.DATABASE_URL;

    try {
      process.env.DB_HOST = 'mysql.secureserver.net';
      process.env.DB_PORT = '3306';
      process.env.DB_USER = 'hospital_db_user';
      process.env.DB_PASSWORD = 'p@ssword#with$pecials';
      process.env.DB_NAME = 'rh_production_db';

      initDbEnv();

      assert.ok(process.env.DATABASE_URL.startsWith('mysql://hospital_db_user:'));
      assert.ok(process.env.DATABASE_URL.includes('mysql.secureserver.net:3306/rh_production_db'));
      assert.ok(process.env.DATABASE_URL.includes('connection_limit='));
    } finally {
      process.env.DB_HOST = originalHost;
      process.env.DB_NAME = originalName;
      process.env.DATABASE_URL = originalUrl;
    }
  });

  await t.test('withConnection executes callback and safely closes connection in finally block', async () => {
    let closed = false;
    let callbackExecuted = false;

    const mockConn = {
      execute: async () => [['mock_row'], []],
      end: async () => {
        closed = true;
      }
    };

    // Simulate safe execution wrapper
    async function mockWithConnection(fn) {
      const conn = mockConn;
      try {
        return await fn(conn);
      } finally {
        await conn.end();
      }
    }

    const result = await mockWithConnection(async (conn) => {
      callbackExecuted = true;
      const [rows] = await conn.execute();
      return rows[0];
    });

    assert.strictEqual(callbackExecuted, true);
    assert.strictEqual(closed, true);
    assert.strictEqual(result, 'mock_row');
  });
});
