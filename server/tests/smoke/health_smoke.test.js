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
});
