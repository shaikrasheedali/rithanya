const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');

test('Rithanya Hospital REST API End-to-End Integration Flows', async (t) => {
  let authToken = null;
  let samplePatientId = null;

  await t.test('POST /api/appointments/book should register a public patient appointment', async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .send({
        patientName: 'Test Patient Srinivas',
        phone: '+91 98480 99887',
        preferredDate: new Date().toISOString(),
        specialty: 'General Medicine & Diabetology',
        reason: 'Routine quarterly diabetes checkup'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.apptCode.startsWith('APT-'));
  });

  await t.test('POST /api/erasure/request should submit a DPDP Right to Erasure request', async () => {
    const res = await request(app)
      .post('/api/erasure/request')
      .send({
        patientName: 'K. Subba Rao',
        phone: '+91 99880 11223',
        identifierLast4: '7765',
        patientCode: 'RH-P99999',
        reason: 'Statutory Right to be Forgotten exercise under DPDP Act 2023'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
  });

  await t.test('POST /api/inquiries should register a healthcare package inquiry', async () => {
    const res = await request(app)
      .post('/api/inquiries')
      .send({
        packageName: 'Comprehensive Diabetic Health Package',
        name: 'V. Krishna',
        phone: '+91 91210 44556',
        message: 'Please advise on fasting instructions before diagnostic collection.'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('POST /api/auth/login should authenticate staff with Argon2 and issue JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'mgrhameed@gmail.com',
        password: 'Hameed@2026'
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    authToken = res.body.token;
  });

  await t.test('GET /api/inventory should return blood units and threshold alerts', async () => {
    assert.ok(authToken);
    const res = await request(app)
      .get('/api/inventory')
      .set('Authorization', `Bearer ${authToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.stocks));
  });
});
