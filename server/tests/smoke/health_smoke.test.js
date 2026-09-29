const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');
const errorHandler = require('../../middlewares/errorHandler');

test('Health Check & Server Smoke Test', async (t) => {
  await t.test('GET /api/health should respond with service status and database state', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.service, 'Rithanya Hospital API');
    assert.strictEqual(res.body.database, 'connected');
    assert.strictEqual(res.body.status, 'healthy');
  });

  await t.test('GET /api/services should return public clinical specialties', async () => {
    const res = await request(app).get('/api/services');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await t.test('GET /api/specialists should return public specialist doctors', async () => {
    const res = await request(app).get('/api/specialists');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await t.test('GET /api/inventory/public should return unreserved live blood bank stock counts', async () => {
    const res = await request(app).get('/api/inventory/public');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.stocks));
    assert.ok(res.body.data.stocks.length >= 8);
    // Verify unreserved live units property exists
    const stockA = res.body.data.stocks[0];
    assert.ok(typeof stockA.availableUnits === 'number');
    assert.ok(typeof stockA.unreservedUnits === 'number');
  });

  await t.test('GET /api/settings should return hospital master profile and SEO config', async () => {
    const res = await request(app).get('/api/settings');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data);
  });

  await t.test('Error Handler: should format missing database error P1003 with 503 and clear message', () => {
    let capturedStatus = null;
    let capturedJson = null;

    const mockRes = {
      status(code) {
        capturedStatus = code;
        return this;
      },
      json(data) {
        capturedJson = data;
        return this;
      }
    };

    const mockP1003Err = new Error('Database does not exist');
    mockP1003Err.code = 'P1003';

    errorHandler(mockP1003Err, {}, mockRes, () => {});

    assert.strictEqual(capturedStatus, 503);
    assert.strictEqual(capturedJson.success, false);
    assert.strictEqual(capturedJson.code, 'P1003');
    assert.ok(capturedJson.message.includes('Database does not exist'));
  });

  await t.test('Error Handler: should format database unreachable error P1001 with 503 and clear message', () => {
    let capturedStatus = null;
    let capturedJson = null;

    const mockRes = {
      status(code) {
        capturedStatus = code;
        return this;
      },
      json(data) {
        capturedJson = data;
        return this;
      }
    };

    const mockP1001Err = new Error('Can not reach database server');
    mockP1001Err.code = 'P1001';

    errorHandler(mockP1001Err, {}, mockRes, () => {});

    assert.strictEqual(capturedStatus, 503);
    assert.strictEqual(capturedJson.success, false);
    assert.strictEqual(capturedJson.code, 'P1001');
    assert.ok(capturedJson.message.includes('Unable to reach database server'));
  });

  await t.test('GET /api/health should include comprehensive dbIntegrity diagnostic report', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.dbIntegrity);
    assert.strictEqual(typeof res.body.dbIntegrity.connected, 'boolean');
    assert.strictEqual(typeof res.body.dbIntegrity.totalTables, 'number');
    assert.ok(Array.isArray(res.body.dbIntegrity.missingTables));
    assert.ok(res.body.dbIntegrity.schemaSyncStatus);
  });

  await t.test('Bot Scanner Blocking Middleware: should block php/asp probes before SPA catch-all', async () => {
    const res1 = await request(app).get('/wp-admin/install.php');
    assert.strictEqual(res1.status, 404);
    assert.strictEqual(res1.body.code, 'SECURITY_BLOCKED');

    const res2 = await request(app).get('/test.php');
    assert.strictEqual(res2.status, 404);
    assert.strictEqual(res2.body.code, 'SECURITY_BLOCKED');

    const res3 = await request(app).get('/.env');
    assert.strictEqual(res3.status, 404);
    assert.strictEqual(res3.body.code, 'SECURITY_BLOCKED');
  });

  await t.test('Asset Self-Healing: should return clean fallback SVG (200 OK) for missing upload assets', async () => {
    const res = await request(app).get('/assets/uploads/non-existent-test-asset.jpg');
    assert.strictEqual(res.status, 200);
    const contentType = res.header['content-type'] || res.get('Content-Type') || '';
    assert.ok(contentType.includes('image/svg+xml'));
    const bodyStr = res.text || (Buffer.isBuffer(res.body) ? res.body.toString('utf8') : String(res.body || ''));
    assert.ok(bodyStr.includes('<svg'));
    assert.ok(bodyStr.includes('RITHANYA HOSPITAL'));
  });

  await t.test('Error Handler: should format missing table error P2021 as standardized SCHEMA_DESYNC', () => {
    let capturedStatus = null;
    let capturedJson = null;

    const mockRes = {
      status(code) {
        capturedStatus = code;
        return this;
      },
      json(data) {
        capturedJson = data;
        return this;
      }
    };

    const mockP2021Err = new Error('The table `BloodReservation` does not exist in the current database.');
    mockP2021Err.code = 'P2021';
    mockP2021Err.meta = { table: 'BloodReservation' };

    errorHandler(mockP2021Err, {}, mockRes, () => {});

    assert.strictEqual(capturedStatus, 503);
    assert.strictEqual(capturedJson.success, false);
    assert.strictEqual(capturedJson.error, 'Database table mismatch');
    assert.strictEqual(capturedJson.code, 'SCHEMA_DESYNC');
    assert.ok(capturedJson.details.includes('BloodReservation'));
  });
});
