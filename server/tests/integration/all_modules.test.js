const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');

test('Comprehensive Full-Stack Hospital ERP & DPDP Suite', async (t) => {
  let superadminToken = null;
  let testPatientId = null;
  let testPatientCode = null;
  let testReadingId = null;
  let testAdmissionId = null;
  let testServiceId = null;
  let testBlogId = null;
  let testSpecialistId = null;
  let testPackageId = null;
  let testInquiryId = null;
  let testGalleryId = null;
  let testStaffId = null;
  let testCredentialId = null;
  let testExpenseId = null;
  let testErasureRequestId = null;

  // 1. AUTHENTICATION & LOGIN
  await t.test('POST /api/auth/login - Superadmin Argon2 Login', async () => {
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

  await t.test('GET /api/auth/me - Verify current authenticated session', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.email, 'mgrhameed@gmail.com');
  });

  // 2. PATIENT CRUD & DPDP CAMERA CONSENT
  await t.test('POST /api/patients - Register new patient with EMR code', async () => {
    const res = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'Suresh Chandra',
        age: 34,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '+91 98490 22119',
        condition: 'Type 2 Diabetes Mellitus',
        allergies: 'None',
        status: 'outpatient'
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.patientCode.startsWith('RH-P'));
    testPatientId = res.body.data.id;
    testPatientCode = res.body.data.patientCode;
  });

  await t.test('POST /api/patients/:id/consent-photo - Record DPDP Digital Camera Photo Signature', async () => {
    const fakePhotoDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...DPDP_CONSENT_SIGNATURE_MOCK...';
    const res = await request(app)
      .post(`/api/patients/${testPatientId}/consent-photo`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ photoDataUrl: fakePhotoDataUrl });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.capturedAt);
  });

  await t.test('GET /api/patients/:id - Retrieve patient details and consent signature', async () => {
    const res = await request(app)
      .get(`/api/patients/${testPatientId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.name, 'Suresh Chandra');
    assert.ok(res.body.data.consentPhotoBlob);
  });

  // 3. CLINICAL VITALS LOGGING
  await t.test('POST /api/clinical - Log clinical vitals', async () => {
    const res = await request(app)
      .post('/api/clinical')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        patientId: testPatientId,
        bloodSugarFasting: 110,
        bloodSugarPP: 165,
        hba1c: 7.2,
        bpSystolic: 130,
        bpDiastolic: 85,
        haemoglobin: 14.1,
        ferritin: 450,
        spo2: 98,
        temperature: 98.6,
        pulse: 74,
        notes: 'Initial clinical vitals logged'
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    testReadingId = res.body.data.id;
  });

  await t.test('PUT /api/clinical/:id - Update clinical reading', async () => {
    const res = await request(app)
      .put(`/api/clinical/${testReadingId}`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ notes: 'Updated notes after doctor consultation' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.notes, 'Updated notes after doctor consultation');
  });

  // 4. DAYCARE ADMISSION & DISCHARGE
  await t.test('POST /api/admissions - Admit patient to Daycare Bed', async () => {
    const res = await request(app)
      .post('/api/admissions')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        patientId: testPatientId,
        ward: 'Daycare Transfusion Ward',
        bed: 'Bed-04',
        diagnosis: 'Observation & glucose stabilization'
      });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    testAdmissionId = res.body.data.id;
  });

  await t.test('PUT /api/admissions/:id/discharge - Discharge patient with summary', async () => {
    const res = await request(app)
      .put(`/api/admissions/${testAdmissionId}/discharge`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ dischargeSummary: 'Patient stabilized. Advised lifestyle modifications.' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.status, 'discharged');
  });

  // 5. BLOOD INVENTORY OPERATIONS
  await t.test('POST /api/inventory/load - Load blood units to inventory', async () => {
    const res = await request(app)
      .post('/api/inventory/load')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        group: 'O+',
        units: 5,
        source: 'Rotary Blood Camp Khammam'
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  await t.test('POST /api/inventory/dispense - Dispense blood unit for patient transfusion', async () => {
    const res = await request(app)
      .post('/api/inventory/dispense')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        group: 'O+',
        units: 1,
        patientId: testPatientId,
        notes: 'Transfusion unit issued'
      });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 6. APPOINTMENTS TRACKING & STATUS
  await t.test('GET /api/appointments/track/:code - Public tracking of appointment', async () => {
    const bookRes = await request(app).post('/api/appointments/book').send({
      patientName: 'K. Sita',
      phone: '+91 99881 22334',
      preferredDate: new Date().toISOString()
    });
    const code = bookRes.body.data.apptCode;

    const trackRes = await request(app).get(`/api/appointments/track/${code}`);
    assert.strictEqual(trackRes.status, 200);
    assert.strictEqual(trackRes.body.data.patientName, 'K. Sita');
  });

  // 7. CMS CRUD: SERVICES, BLOGS, SPECIALISTS, PACKAGES
  await t.test('CMS Services CRUD', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        title: 'Test Cardiology Screen',
        category: 'Diagnostic Specialty',
        summary: 'Heart health overview',
        content: '<p>Comprehensive ECG and cardiac markers</p>',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85'
      });
    assert.strictEqual(createRes.status, 201);
    testServiceId = createRes.body.data.id;

    // Read by slug
    const readRes = await request(app).get(`/api/services/${createRes.body.data.slug}`);
    assert.strictEqual(readRes.status, 200);

    // Delete
    const delRes = await request(app)
      .delete(`/api/services/${testServiceId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(delRes.status, 200);
  });

  await t.test('CMS Health Blogs CRUD', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        title: 'Test Nutrition Guide',
        category: 'Preventive Health',
        summary: 'Healthy regional diet',
        content: '<p>Nutritional guidelines</p>',
        coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=85'
      });
    assert.strictEqual(createRes.status, 201);
    testBlogId = createRes.body.data.id;

    // Delete
    const delRes = await request(app)
      .delete(`/api/blogs/${testBlogId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(delRes.status, 200);
  });

  // 8. STAFF HR & CREDENTIALS
  await t.test('Staff HR & User Credential Creation with Argon2', async () => {
    const testStaffEmail = `anand.${Date.now()}@rithanya.in`;

    // Create staff
    const staffRes = await request(app)
      .post('/api/staff')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'P. Anand Kumar',
        designation: 'Staff Pharmacist',
        department: 'Pharmacy',
        salary: 30000,
        phone: '+91 97000 88990',
        email: testStaffEmail
      });
    assert.strictEqual(staffRes.status, 201);
    testStaffId = staffRes.body.data.id;

    // Create credential for staff
    const credRes = await request(app)
      .post('/api/credentials')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'P. Anand Kumar',
        email: testStaffEmail,
        password: 'Pharmacist@2026',
        role: 'STAFF',
        staffId: testStaffId,
        permissions: { inventory: true, dashboard: true }
      });
    assert.strictEqual(credRes.status, 201);
    testCredentialId = credRes.body.data.id;

    // Reset password
    const resetRes = await request(app)
      .put(`/api/credentials/${testCredentialId}/reset-password`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ newPassword: 'NewPharmacistPass@2026' });
    assert.strictEqual(resetRes.status, 200);

    // Delete test credential and staff
    await request(app).delete(`/api/credentials/${testCredentialId}`).set('Authorization', `Bearer ${superadminToken}`);
    await request(app).delete(`/api/staff/${testStaffId}`).set('Authorization', `Bearer ${superadminToken}`);
  });

  // 9. FINANCE & EXPENSES
  await t.test('Finance & Expenses CRUD', async () => {
    const expRes = await request(app)
      .post('/api/finance')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'Test Syringe Packets',
        category: 'Medical supplies',
        vendor: 'Local Medico Khammam',
        amount: 3500
      });
    assert.strictEqual(expRes.status, 201);
    testExpenseId = expRes.body.data.id;

    const delExp = await request(app)
      .delete(`/api/finance/${testExpenseId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(delExp.status, 200);
  });

  // 10. DPDP RIGHT TO ERASURE ("RIGHT TO BE FORGOTTEN") CASCADING PURGE
  await t.test('DPDP Right to Erasure: Submit, Approve & Cascading Data Purge', async () => {
    // 1. Submit erasure request for our test patient
    const submitReq = await request(app)
      .post('/api/erasure/request')
      .send({
        patientName: 'Suresh Chandra',
        phone: '+91 98490 22119',
        patientCode: testPatientCode,
        reason: 'Patient relocated out of state - Statutory erasure requested'
      });
    assert.strictEqual(submitReq.status, 201);
    testErasureRequestId = submitReq.body.data.id;

    // 2. Admin approves erasure and executes cascading purge
    const approveRes = await request(app)
      .post(`/api/erasure/requests/${testErasureRequestId}/approve`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ notes: 'Verified identity and purged records' });
    assert.strictEqual(approveRes.status, 200);
    assert.strictEqual(approveRes.body.success, true);

    // 3. Confirm that patient and all associated readings were purged
    const checkPatient = await request(app)
      .get(`/api/patients/${testPatientId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(checkPatient.status, 404);
  });

  // 11. AUDIT TRAIL & SYSTEM BACKUP EXPORT
  await t.test('GET /api/audit - Verify audit logs contain operations trail', async () => {
    const auditRes = await request(app)
      .get('/api/audit?limit=10')
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(auditRes.status, 200);
    assert.ok(Array.isArray(auditRes.body.data));
    assert.ok(auditRes.body.data.length > 0);
  });

  await t.test('GET /api/settings/backup/export - Export database snapshot', async () => {
    const backupRes = await request(app)
      .get('/api/settings/backup/export')
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(backupRes.status, 200);
    assert.strictEqual(backupRes.body.success, true);
    assert.ok(backupRes.body.data.exportedAt);
  });
});
