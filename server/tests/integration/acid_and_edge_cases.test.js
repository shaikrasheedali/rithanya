const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');
const prisma = require('../../config/db');

test('ACID Transactions, Concurrency & Edge-Cases Test Suite', async (t) => {
  let superadminToken = null;
  let testPatientId = null;

  // Setup: Authenticate Superadmin
  await t.test('Setup: Authenticate Superadmin for ACID suite', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'mgrhameed@gmail.com',
      password: 'Hameed@2026'
    });
    assert.strictEqual(res.status, 200);
    superadminToken = res.body.token;
  });

  // 1. ACID TRANSACTION ROLLBACK VERIFICATION
  await t.test('ACID: Transaction rollback leaves zero orphaned records on failure', async () => {
    const initialPatientCount = await prisma.patient.count();
    const testCode = `RH-ACID-${Date.now().toString().slice(-4)}`;

    try {
      // Execute a multi-operation transaction where the second operation deliberately fails
      await prisma.$transaction(async (tx) => {
        await tx.patient.create({
          data: {
            patientCode: testCode,
            name: 'ACID Rollback Test Subject',
            age: 45,
            gender: 'Female',
            bloodGroup: 'AB+',
            phone: '+91 91234 56789',
            condition: 'Gestational Diabetes'
          }
        });

        // Deliberately trigger an error to simulate mid-flight database or constraint failure
        throw new Error('SIMULATED_TRANSACTION_FAILURE_TRIGGER_ROLLBACK');
      }, { maxWait: 10000, timeout: 30000 });
    } catch (err) {
      assert.strictEqual(err.message, 'SIMULATED_TRANSACTION_FAILURE_TRIGGER_ROLLBACK');
    }

    // Verify ACID Atomicity: The patient created in step 1 MUST NOT exist
    const patientAfterRollback = await prisma.patient.findUnique({
      where: { patientCode: testCode }
    });
    assert.strictEqual(patientAfterRollback, null, 'Uncommitted transaction record must not persist');

    const finalPatientCount = await prisma.patient.count();
    assert.strictEqual(finalPatientCount, initialPatientCount, 'Total record count must remain identical');
  });

  // 2. CONCURRENCY & RACE-CONDITION PREVENTION IN BLOOD INVENTORY
  await t.test('ACID: Atomic blood inventory dispensing prevents negative stock under concurrent requests', async () => {
    const testGroup = 'AB-';

    // Set stock to exactly 1 unit
    await prisma.bloodInventory.upsert({
      where: { group: testGroup },
      update: { units: 1, reservedUnits: 0, expiryDate: new Date(Date.now() + 30 * 86400000) },
      create: { group: testGroup, units: 1, reservedUnits: 0, expiryDate: new Date(Date.now() + 30 * 86400000) }
    });

    // Execute 2 simultaneous dispense attempts for 1 unit each
    const [res1, res2] = await Promise.all([
      request(app)
        .post('/api/inventory/dispense')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({ group: testGroup, units: 1, notes: 'Concurrent dispense attempt 1' }),
      request(app)
        .post('/api/inventory/dispense')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({ group: testGroup, units: 1, notes: 'Concurrent dispense attempt 2' })
    ]);

    // Exactly one must succeed (200) and one must be rejected (400 Insufficient or 409 Conflict)
    const successRes = res1.status === 200 ? res1 : res2;
    const rejectedRes = res1.status === 200 ? res2 : res1;
    assert.strictEqual(successRes.status, 200, 'One request must succeed');
    assert.ok([400, 409].includes(rejectedRes.status), 'The conflicting concurrent request must be rejected with 400 or 409');

    // Verify stock is exactly 0 and NEVER negative
    const finalStock = await prisma.bloodInventory.findUnique({ where: { group: testGroup } });
    assert.strictEqual(finalStock.units, 0, 'Final blood stock must be exactly 0, never negative');
  });

  // 3. ATOMIC DAYCARE ADMISSION & PATIENT STATUS SYNCHRONIZATION
  await t.test('ACID: Patient admission updates both admission log and patient status atomically', async () => {
    const pRes = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'Lakshmi Devi',
        age: 28,
        gender: 'Female',
        bloodGroup: 'O+',
        phone: '+91 98480 99887',
        condition: 'Thalassemia Minor Iron Deficiency',
        status: 'outpatient'
      });
    assert.strictEqual(pRes.status, 201);
    testPatientId = pRes.body.data.id;

    const admRes = await request(app)
      .post('/api/admissions')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        patientId: testPatientId,
        ward: 'Daycare Transfusion Ward',
        bed: 'Bed-05',
        diagnosis: 'Elective outpatient to daycare transfusion'
      });
    assert.strictEqual(admRes.status, 201);

    // Verify patient status is atomically updated to admitted
    const checkPatient = await request(app)
      .get(`/api/patients/${testPatientId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(checkPatient.body.data.status, 'admitted');
  });

  // 4. ATOMIC DPDP RIGHT TO ERASURE CASCADING PURGE
  await t.test('ACID: DPDP Right to Erasure completely purges patient and linked records atomically', async () => {
    // Add clinical reading to this patient
    await request(app)
      .post('/api/clinical')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        patientId: testPatientId,
        haemoglobin: 9.4,
        spo2: 99,
        pulse: 78
      });

    // Execute purge
    const purgeRes = await request(app)
      .delete(`/api/patients/${testPatientId}/purge`)
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ reason: 'DPDP statutory erasure verification' });
    assert.strictEqual(purgeRes.status, 200);

    // Verify patient is gone
    const checkPatient = await request(app)
      .get(`/api/patients/${testPatientId}`)
      .set('Authorization', `Bearer ${superadminToken}`);
    assert.strictEqual(checkPatient.status, 404);

    // Verify cascaded clinical readings are gone
    const orphanReadings = await prisma.clinicalReading.findMany({ where: { patientId: testPatientId } });
    assert.strictEqual(orphanReadings.length, 0);

    // Verify cascaded admissions are gone
    const orphanAdmissions = await prisma.admission.findMany({ where: { patientId: testPatientId } });
    assert.strictEqual(orphanAdmissions.length, 0);
  });

  // 5. SLUG COLLISION UNIQUENESS & CONFLICT RESILIENCE
  await t.test('Edge Case: Duplicate doctor names generate unique slugs without 500 error', async () => {
    const doc1 = await request(app)
      .post('/api/specialists')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'Dr. Suresh Babu',
        designation: 'Consultant Hematologist',
        department: 'Hematology',
        qualifications: 'MBBS, MD',
        experience: '10 Years'
      });
    assert.strictEqual(doc1.status, 201);
    const slug1 = doc1.body.data.slug;

    // Create another doctor with the exact same name
    const doc2 = await request(app)
      .post('/api/specialists')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({
        name: 'Dr. Suresh Babu',
        designation: 'Consultant Hematologist',
        department: 'Hematology',
        qualifications: 'MBBS, MD',
        experience: '10 Years'
      });
    assert.strictEqual(doc2.status, 201);
    const slug2 = doc2.body.data.slug;

    // Both must be created successfully and have distinct slugs
    assert.notStrictEqual(slug1, slug2, 'Duplicate names must receive distinct unique slugs');

    // Clean up
    await request(app).delete(`/api/specialists/${doc1.body.data.id}`).set('Authorization', `Bearer ${superadminToken}`);
    await request(app).delete(`/api/specialists/${doc2.body.data.id}`).set('Authorization', `Bearer ${superadminToken}`);
  });

  // 6. IDEMPOTENT DELETE & P2025 RECORD-NOT-FOUND RESILIENCE
  await t.test('Edge Case: Deleting non-existent CMS items returns 404 instead of 500 P2025 error', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';

    const [delBlog, delSpec, delServ, delTreat, delProd] = await Promise.all([
      request(app).delete(`/api/blogs/${fakeUuid}`).set('Authorization', `Bearer ${superadminToken}`),
      request(app).delete(`/api/specialists/${fakeUuid}`).set('Authorization', `Bearer ${superadminToken}`),
      request(app).delete(`/api/services/${fakeUuid}`).set('Authorization', `Bearer ${superadminToken}`),
      request(app).delete(`/api/treatments/${fakeUuid}`).set('Authorization', `Bearer ${superadminToken}`),
      request(app).delete(`/api/products/${fakeUuid}`).set('Authorization', `Bearer ${superadminToken}`)
    ]);

    assert.strictEqual(delBlog.status, 404);
    assert.strictEqual(delSpec.status, 404);
    assert.strictEqual(delServ.status, 404);
    assert.strictEqual(delTreat.status, 404);
    assert.strictEqual(delProd.status, 404);
  });

  // 7. CLINICAL VITALS PHYSIOLOGICAL BOUNDARY INTEGRITY
  await t.test('Edge Case: Out-of-bounds physiological values rejected with 400', async () => {
    // Missing patient
    const resNoPatient = await request(app)
      .post('/api/clinical')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ haemoglobin: 12.0 });
    assert.strictEqual(resNoPatient.status, 400);

    // Negative pulse
    const resNegPulse = await request(app)
      .post('/api/clinical')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ patientId: 'some-id', pulse: -5 });
    assert.strictEqual(resNegPulse.status, 400);

    // Negative Haemoglobin
    const resNegHb = await request(app)
      .post('/api/clinical')
      .set('Authorization', `Bearer ${superadminToken}`)
      .send({ patientId: 'some-id', haemoglobin: -2.0 });
    assert.strictEqual(resNegHb.status, 400);
  });
});
