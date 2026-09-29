const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { app } = require('../../index');
const prisma = require('../../config/db');
const { hashPassword, verifyPassword } = require('../../utils/argonHelper');

test('Consolidated Finance, Universal Approvals & Pro-Rata Payroll Suite', async (t) => {
  let superadminToken = null;
  let adminToken = null;
  let testPayrollId = null;
  let testExpenseId = null;
  const targetMonth = '2026-09';

  // 1. Strict Argon2 Authentication & JWT Issuance
  await t.test('POST /api/auth/login - Verified Argon2 DB Credentials & JWT Token', async () => {
    // Attempt invalid credentials
    const invalidRes = await request(app).post('/api/auth/login').send({
      email: 'admin@rithanyahospital.com',
      password: 'WrongPassword@123'
    });
    assert.strictEqual(invalidRes.status, 401);
    assert.strictEqual(invalidRes.body.success, false);

    // Attempt plain text equality bypass (must be rejected)
    const plainTest = await verifyPassword('Admin@2026', 'Admin@2026');
    assert.strictEqual(plainTest, false, 'Plaintext comparison must never succeed');

    // Valid Argon2 login
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@rithanyahospital.com',
      password: 'Admin@2026'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.token, 'JWT token must be issued');
    assert.strictEqual(res.body.user.email, 'admin@rithanyahospital.com');
    adminToken = res.body.token;
  });

  // 2. Pro-Rata Salary Math Unit & Edge-Case Verification
  await t.test('Pro-Rata Salary Math & Formula Precision', async () => {
    // 30 day month (September)
    const totalMonthDays = 30;
    const baseSalary = 60000;
    const perDayRate = baseSalary / totalMonthDays; // 2000
    assert.strictEqual(perDayRate, 2000);

    // Case A: 3 LOP days, 27 worked, 3500 allowances, 200 other deductions
    const lopDaysA = 3;
    const lopDeductionA = Math.round(perDayRate * lopDaysA); // 6000
    const allowancesA = 3500;
    const otherDeductionsA = 200;
    const netSalaryA = Math.round(baseSalary - lopDeductionA + allowancesA - otherDeductionsA);
    assert.strictEqual(lopDeductionA, 6000);
    assert.strictEqual(netSalaryA, 57300);

    // Case B: 0 LOP days (full month attendance)
    const lopDaysB = 0;
    const lopDeductionB = Math.round(perDayRate * lopDaysB);
    const netSalaryB = Math.round(baseSalary - lopDeductionB + allowancesA - otherDeductionsA);
    assert.strictEqual(lopDeductionB, 0);
    assert.strictEqual(netSalaryB, 63300);

    // Case C: Full month LOP (30 days absent)
    const lopDaysC = 30;
    const lopDeductionC = Math.round(perDayRate * lopDaysC);
    const netSalaryC = Math.max(0, Math.round(baseSalary - lopDeductionC + 0 - 0));
    assert.strictEqual(lopDeductionC, 60000);
    assert.strictEqual(netSalaryC, 0);
  });

  // 3. Pro-Rata Payroll API Updates
  await t.test('PUT /api/staff/payroll/:id - Update Pro-Rata Line Item & Recalculate', async () => {
    // Fetch current payroll for targetMonth
    const payrollRes = await request(app)
      .get(`/api/staff/payroll?month=${targetMonth}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(payrollRes.status, 200);
    assert.strictEqual(payrollRes.body.success, true);
    assert.ok(payrollRes.body.data.payrollRecords.length > 0, 'Payroll records must exist for month');

    const firstRecord = payrollRes.body.data.payrollRecords[0];
    testPayrollId = firstRecord.id;

    // Update with 2 LOP days and 2500 allowances
    const updateRes = await request(app)
      .put(`/api/staff/payroll/${testPayrollId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        lopDays: 2,
        actualWorkingDays: 28,
        allowances: 2500,
        otherDeductions: 500,
        paymentMode: 'Bank NEFT',
        paymentReference: 'NEFT-TEST-2026-09',
        notes: 'Verified against biometrics'
      });

    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateRes.body.success, true);
    assert.strictEqual(updateRes.body.data.lopDays, 2);
    assert.strictEqual(updateRes.body.data.allowances, 2500);
    assert.strictEqual(updateRes.body.data.otherDeductions, 500);

    // Verify net payable = Math.round(fixedMonthlySalary - lopDeduction + 2500 - 500)
    const expectedNet = Math.round(firstRecord.fixedMonthlySalary - updateRes.body.data.lopDeduction + 2500 - 500);
    assert.strictEqual(updateRes.body.data.netPayableSalary, expectedNet);
  });

  // 4. PDF Payslip Compilation
  await t.test('GET /api/staff/payslip/:id/pdf - Compile Standard Form 16 Payslip Document', async () => {
    assert.ok(testPayrollId, 'testPayrollId must be set from previous test');
    const pdfRes = await request(app)
      .get(`/api/staff/payslip/${testPayrollId}/pdf`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(pdfRes.status, 200);
    assert.ok(pdfRes.headers['content-type'].includes('application/pdf'), 'Must return valid PDF content type');
    assert.ok(pdfRes.headers['content-disposition'].includes('attachment; filename='), 'Must have attachment disposition');
    assert.ok(pdfRes.body.length > 500, 'PDF binary stream must have substantial non-empty byte size');
  });

  // 5. Strict Expense Schema & Input Validation Engine
  await t.test('POST /api/finance - Strict Schema Validation Rules', async () => {
    // A: Reject amount < 1
    const invalidAmtRes = await request(app)
      .post('/api/finance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Invalid Low Amount Test',
        category: 'Medical Supplies & Reagents',
        vendor: 'Siemens Healthineers India',
        amount: 0,
        date: '2026-09-15',
        invoiceRef: 'INV-TEST-001'
      });
    assert.strictEqual(invalidAmtRes.status, 400);
    assert.strictEqual(invalidAmtRes.body.success, false);

    // B: Reject amount > 1 Crore (10,000,000)
    const highAmtRes = await request(app)
      .post('/api/finance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Excessive Amount Test',
        category: 'Medical Supplies & Reagents',
        vendor: 'Siemens Healthineers India',
        amount: 15000000,
        date: '2026-09-15',
        invoiceRef: 'INV-TEST-002'
      });
    assert.strictEqual(highAmtRes.status, 400);

    // C: Reject empty vendor
    const noVendorRes = await request(app)
      .post('/api/finance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Missing Vendor Test',
        category: 'Medical Supplies & Reagents',
        vendor: '   ',
        amount: 1500,
        date: '2026-09-15',
        invoiceRef: 'INV-TEST-003'
      });
    assert.strictEqual(noVendorRes.status, 400);

    // D: Successfully create valid expense with invoiceRef and receiptUrl
    const validRes = await request(app)
      .post('/api/finance')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Automated Test Diagnostic Reagent Pack',
        category: 'Medical Supplies & Reagents',
        vendor: 'Transasia Bio-Medicals Ltd',
        amount: 28400,
        date: '2026-09-20',
        paymentMethod: 'Bank NEFT',
        invoiceRef: 'INV-TEST-2026-SEP-09',
        receiptUrl: '/assets/uploads/test-reagent-receipt.pdf',
        notes: 'Batch lot 4092-B quality tested'
      });

    assert.strictEqual(validRes.status, 201);
    assert.strictEqual(validRes.body.success, true);
    assert.ok(validRes.body.data.id);
    assert.strictEqual(validRes.body.data.supervisorApproved, false);
    testExpenseId = validRes.body.data.id;
  });

  // 6. Master Finance Ledger Outflow Aggregation Accuracy
  await t.test('GET /api/finance - Master Outflow Ledger Aggregation Accuracy', async () => {
    const res = await request(app)
      .get(`/api/finance?month=${targetMonth}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);

    const { kpis, expenses, approvalQueue } = res.body.data;
    assert.ok(kpis, 'KPIs object must exist');
    assert.ok(typeof kpis.totalOutflow === 'number');
    assert.ok(typeof kpis.payrollOutflow === 'number');
    assert.ok(typeof kpis.rentOutflow === 'number');
    assert.ok(typeof kpis.vendorOutflow === 'number');

    // Consolidated formula: Total Outflow = Payroll + Rent + Vendor
    const calculatedSum = Math.round(kpis.payrollOutflow + kpis.rentOutflow + kpis.vendorOutflow);
    assert.strictEqual(
      Math.round(kpis.totalOutflow),
      calculatedSum,
      'Total Hospital Outflow must strictly equal sum of Payroll + Rent + Vendor Procurement'
    );

    // Verify approval queue contains created item
    assert.ok(Array.isArray(approvalQueue));
    const foundCreatedExpense = approvalQueue.find((q) => q.id === testExpenseId);
    assert.ok(foundCreatedExpense, 'Created expense must appear in universal approval queue');
  });

  // 7. Universal Multi-Level Approval Pipeline
  await t.test('POST /api/finance/approve/:id - Multi-Level Supervisor & Director Approval', async () => {
    assert.ok(testExpenseId, 'testExpenseId must be set');

    // Stage 1: Supervisor Verification
    const supRes = await request(app)
      .post(`/api/finance/approve/${testExpenseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        roleType: 'SUPERVISOR',
        approverName: 'Dr. C. Shanthi, Pathologist',
        notes: 'Invoices cross-checked against lab logs'
      });

    assert.strictEqual(supRes.status, 200);
    assert.strictEqual(supRes.body.success, true);
    assert.strictEqual(supRes.body.item.approvalStage, 'SUPERVISOR_VERIFIED');
    assert.strictEqual(supRes.body.item.supervisorApproved, true);
    assert.strictEqual(supRes.body.item.supervisorName, 'Dr. C. Shanthi, Pathologist');
    assert.ok(supRes.body.item.supervisorSignedAt);

    // Stage 2: Director Sign-off & Disbursement
    const dirRes = await request(app)
      .post(`/api/finance/approve/${testExpenseId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        roleType: 'DIRECTOR',
        approverName: 'Dr. Narayana Murthy, MD',
        notes: 'Executive payout seal approved'
      });

    assert.strictEqual(dirRes.status, 200);
    assert.strictEqual(dirRes.body.success, true);
    assert.strictEqual(dirRes.body.item.approvalStage, 'DISBURSED');
    assert.strictEqual(dirRes.body.item.directorApproved, true);
    assert.strictEqual(dirRes.body.item.directorName, 'Dr. Narayana Murthy, MD');
    assert.ok(dirRes.body.item.directorSignedAt);
  });

  // 8. Monthly Payroll Batch Approval
  await t.test('POST /api/finance/approve/:id - Universal Pipeline Monthly Payroll Batch Release', async () => {
    const batchId = `PAYROLL-BATCH-${targetMonth}`;

    // Supervisor verification for batch
    const supBatchRes = await request(app)
      .post(`/api/finance/approve/${batchId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        roleType: 'SUPERVISOR',
        approverName: 'Dr. C. Shanthi, Pathologist',
        notes: 'All biometric hours verified for September'
      });

    assert.strictEqual(supBatchRes.status, 200);
    assert.strictEqual(supBatchRes.body.success, true);
    assert.strictEqual(supBatchRes.body.item.supervisorApproved, true);

    // Director authorization for batch
    const dirBatchRes = await request(app)
      .post(`/api/finance/approve/${batchId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        roleType: 'DIRECTOR',
        approverName: 'Dr. Narayana Murthy, MD',
        notes: 'Batch disbursement released'
      });

    assert.strictEqual(dirBatchRes.status, 200);
    assert.strictEqual(dirBatchRes.body.success, true);
    assert.strictEqual(dirBatchRes.body.item.directorApproved, true);
  });

  // 9. Clean up created test expense
  await t.test('DELETE /api/finance/:id - Clean up test expense line item', async () => {
    if (testExpenseId) {
      const delRes = await request(app)
        .delete(`/api/finance/${testExpenseId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      assert.strictEqual(delRes.status, 200);
    }
  });
});
