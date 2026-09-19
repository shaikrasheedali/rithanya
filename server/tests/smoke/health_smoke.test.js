const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');

test('Health Check & Server Smoke Test', async (t) => {
  await t.test('GET /api/health should respond with service status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.service, 'Rithanya Hospital API');
    assert.strictEqual(res.body.database, 'connected');
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
});
