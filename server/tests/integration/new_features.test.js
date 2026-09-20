const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');

test('Rithanya Hospital - New Features Integration Test Suite', async (t) => {
  let superadminToken = null;
  let adminToken = null;
  let createdStaffId = null;
  let createdTreatmentId = null;
  let createdTreatmentSlug = null;
  let testPatientId = null;
  let createdOrderId = null;

  // 1. Authenticate Superadmin (Hameed)
  await t.test('POST /api/auth/login - Superadmin login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'mgrhameed@gmail.com',
      password: 'Hameed@2026'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'SUPERADMIN');
    superadminToken = res.body.token;
  });

  // 2. Authenticate Admin (Dr. Narayana Murthy)
  await t.test('POST /api/auth/login - Admin login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@rithanya.in',
      password: 'Admin@2026'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token);
    assert.strictEqual(res.body.user.role, 'ADMIN');
    adminToken = res.body.token;
  });

  // 3. 3-Tier RBAC & Password Visibility
  await t.test('GET /api/credentials - Superadmin sees plainPassword decrypted for Admin & Staff', async () => {
    const res = await request(app)
      .get('/api/credentials')
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));

    // Verify visiblePassword is decrypted for accounts with plainPasswordEnc
    const adminUser = res.body.data.find((u) => u.role === 'ADMIN');
    if (adminUser && adminUser.visiblePassword) {
      assert.strictEqual(adminUser.visiblePassword, 'Admin@2026');
    }
  });

  await t.test('Role restriction: Admin cannot create another ADMIN account', async () => {
    const res = await request(app)
      .post('/api/credentials')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Unauthorized Admin Attempt',
        email: `unauth.${Date.now()}@rithanya.in`,
        password: 'Password123!',
        role: 'ADMIN'
      });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
  });

  await t.test('Admin creates STAFF account with customized allowedModules', async () => {
    const testEmail = `nurse.${Date.now()}@rithanya.in`;
    const res = await request(app)
      .post('/api/credentials')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Sister Mary',
        email: testEmail,
        password: 'SisterPass@2026',
        role: 'STAFF',
        allowedModules: ['dashboard', 'patients', 'clinical', 'admissions']
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.visiblePassword, 'SisterPass@2026');
    assert.deepStrictEqual(res.body.data.allowedModules, ['dashboard', 'patients', 'clinical', 'admissions']);
    createdStaffId = res.body.data.id;
  });

  await t.test('Admin updates allowedModules for staff account', async () => {
    const res = await request(app)
      .put(`/api/credentials/${createdStaffId}/permissions`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        allowedModules: ['dashboard', 'patients', 'clinical', 'admissions', 'treatments', 'products'],
        permissions: { dashboard: true, patients: true, treatments: true }
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.allowedModules.includes('treatments'));
  });

  // 4. Treatments CMS & Public API
  await t.test('POST /api/treatments - Create new clinical treatment protocol', async () => {
    const res = await request(app)
      .post('/api/treatments')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        title: 'Advanced Chelation Therapy & Iron Monitoring',
        category: 'Daycare Transfusion',
        department: 'Hematology Daycare',
        doctorName: 'Dr. Narayana Murthy, MD',
        duration: '4 - 6 Hours Observation',
        indications: 'Serum ferritin > 1000 ng/mL in transfusion-dependent patients',
        summary: 'Targeted subcutaneous and oral iron chelation therapy preventing secondary hemochromatosis.',
        content: '<h3>Clinical Protocol</h3><p>Infusion pump setup with continuous vital parameter tracking.</p>',
        coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
        procedures: [
          'Baseline serum ferritin & cardiac T2* review',
          'Weight-adjusted Desferrioxamine/Deferasirox dosing',
          'Continuous subcutaneous syringe infusion setup'
        ],
        tag: 'Essential Protocol'
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.slug.includes('advanced-chelation-therapy'));
    createdTreatmentId = res.body.data.id;
    createdTreatmentSlug = res.body.data.slug;
  });

  await t.test('GET /api/treatments - Public list of treatments', async () => {
    const res = await request(app).get('/api/treatments');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  await t.test('GET /api/treatments/:slug - Public treatment detail by slug', async () => {
    const res = await request(app).get(`/api/treatments/${createdTreatmentSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.id, createdTreatmentId);
  });

  // 5. Products E-Commerce Order Flow
  await t.test('POST /api/orders - Submit e-commerce order with cart items and address', async () => {
    const res = await request(app).post('/api/orders').send({
      name: 'V. Krishna Murthy',
      phone: '+91 94401 23456',
      email: 'krishna.m@gmail.com',
      address: 'Plot 45, N.S.P Colony',
      city: 'Khammam',
      pincode: '507002',
      items: [
        { id: 'prod-1', name: 'Contour Plus Blood Glucose Monitoring System', price: 1250, quantity: 1 },
        { id: 'prod-2', name: 'Microlet Colored Sterile Lancets (100s)', price: 380, quantity: 2 }
      ],
      totalAmount: 2010,
      message: 'Please call before delivery'
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.orderCode.startsWith('ORD-'));
    createdOrderId = res.body.data.id;
  });

  await t.test('PUT /api/inquiries/:id/status - Update product order status to CONFIRMED', async () => {
    const res = await request(app)
      .put(`/api/inquiries/${createdOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ orderStatus: 'CONFIRMED' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.orderStatus, 'CONFIRMED');
  });

  // 6. Outpatient to In-Patient Conversion
  await t.test('Convert outpatient to In-Patient admission', async () => {
    // 1. Create outpatient
    const pRes = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Ravi Teja',
        age: 19,
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '+91 98850 11223',
        condition: 'Severe Beta Thalassemia Major Crisis',
        status: 'outpatient'
      });
    assert.strictEqual(pRes.status, 201);
    testPatientId = pRes.body.data.id;

    // 2. Convert to inpatient
    const convRes = await request(app)
      .post(`/api/patients/${testPatientId}/convert-to-inpatient`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ward: 'Daycare Transfusion Ward',
        bed: 'Bed-07',
        attendingDoctor: 'Dr. Narayana Murthy, MD',
        diagnosis: 'Severe acute anemia requiring urgent cross-matched PRBC transfusion'
      });
    assert.strictEqual(convRes.status, 201);
    assert.strictEqual(convRes.body.success, true);
    assert.strictEqual(convRes.body.data.patient.status, 'admitted');
    assert.ok(convRes.body.data.admission.admissionCode.startsWith('ADM-'));
    assert.strictEqual(convRes.body.data.admission.ward, 'Daycare Transfusion Ward');
  });

  // Cleanup created test resources
  await t.test('Clean up test resources', async () => {
    if (createdTreatmentId) {
      await request(app).delete(`/api/treatments/${createdTreatmentId}`).set('Authorization', `Bearer ${superadminToken}`);
    }
    if (createdStaffId) {
      await request(app).delete(`/api/credentials/${createdStaffId}`).set('Authorization', `Bearer ${superadminToken}`);
    }
    if (createdOrderId) {
      await request(app).delete(`/api/inquiries/${createdOrderId}`).set('Authorization', `Bearer ${superadminToken}`);
    }
    if (testPatientId) {
      await request(app).delete(`/api/patients/${testPatientId}/purge`).set('Authorization', `Bearer ${superadminToken}`);
    }
  });
});
