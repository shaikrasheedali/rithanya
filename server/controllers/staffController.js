const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

// Helper to determine total days in a month string "YYYY-MM"
function getMonthDays(monthStr) {
  if (!monthStr || !monthStr.includes('-')) return 30;
  const [yearStr, monthNumStr] = monthStr.split('-');
  const y = parseInt(yearStr, 10);
  const m = parseInt(monthNumStr, 10);
  return new Date(y, m, 0).getDate();
}

/**
 * Standard Staff Directory
 */
async function getStaff(req, res, next) {
  try {
    const { department, status } = req.query;

    const staff = await prisma.staff.findMany({
      where: {
        ...(department && { department }),
        ...(status && { status })
      },
      include: {
        user: {
          select: { id: true, email: true, role: true, enabled: true, permissions: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

async function createStaff(req, res, next) {
  try {
    const { name, designation, department, salary, shift, phone, email, status } = req.body;

    if (!name || !designation || !department || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Name, designation, department, phone, and email are required' });
    }

    let nextNum = 100;
    const existingCodes = await prisma.staff.findMany({ select: { staffCode: true } });
    const nums = existingCodes
      .map(s => {
        const match = s.staffCode && s.staffCode.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => !isNaN(n) && n >= 100);
    if (nums.length > 0) {
      nextNum = Math.max(...nums) + 1;
    } else {
      nextNum = 101;
    }
    const staffCode = `RH-${nextNum}`;

    const member = await prisma.staff.create({
      data: {
        staffCode,
        name: name.trim(),
        designation: designation.trim(),
        department: department.trim(),
        salary: salary ? parseFloat(salary) : 0,
        shift: shift || 'Day',
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        status: status || 'active'
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'CREATE_STAFF',
      module: 'STAFF',
      recordId: member.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { staffCode: member.staffCode, name: member.name }
    });

    return res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function updateStaff(req, res, next) {
  try {
    const { id } = req.params;
    const { name, designation, department, salary, shift, phone, email, status } = req.body;

    const member = await prisma.staff.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(designation && { designation: designation.trim() }),
        ...(department && { department: department.trim() }),
        ...(salary !== undefined && { salary: parseFloat(salary) }),
        ...(shift && { shift }),
        ...(phone && { phone: phone.trim() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(status && { status })
      }
    });

    return res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    return res.json({ success: true, message: 'Staff profile removed' });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 8: MONTHLY PRO-RATA PAYROLL ENGINE
 * GET /api/staff/payroll?month=YYYY-MM
 */
async function getMonthlyPayroll(req, res, next) {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    const calendarDays = getMonthDays(month);

    // 1. Fetch all active staff
    const allStaff = await prisma.staff.findMany({
      where: { status: 'active' },
      orderBy: { staffCode: 'asc' }
    });

    // 2. Fetch existing payroll records for this month
    const existingRecords = await prisma.staffPayroll.findMany({
      where: { payrollMonth: month }
    });
    const recordMap = new Map(existingRecords.map(r => [r.staffId, r]));

    // 3. For any staff without a payroll record for this month, initialize pro-rata record
    for (const staff of allStaff) {
      if (!recordMap.has(staff.id)) {
        const fixedSalary = staff.salary || 0;
        const lopDays = 0;
        const paidDays = calendarDays;
        const actualWorkingDays = Math.max(1, calendarDays - 4); // ~26 days
        const perDayRate = fixedSalary > 0 ? parseFloat((fixedSalary / calendarDays).toFixed(2)) : 0;
        const lopDeduction = 0;
        const allowances = 0;
        const otherDeductions = 0;
        const netPayableSalary = fixedSalary;

        const newRecord = await prisma.staffPayroll.create({
          data: {
            payrollMonth: month,
            staffId: staff.id,
            staffCode: staff.staffCode,
            staffName: staff.name,
            designation: staff.designation,
            department: staff.department,
            fixedMonthlySalary: fixedSalary,
            totalCalendarDays: calendarDays,
            actualWorkingDays,
            lopDays,
            paidDays,
            perDayRate,
            lopDeduction,
            allowances,
            otherDeductions,
            netPayableSalary,
            status: 'DRAFT',
            paymentMode: 'Bank Transfer'
          }
        });
        recordMap.set(staff.id, newRecord);
      }
    }

    // 4. Re-fetch all payroll records for the month
    const payrollRecords = await prisma.staffPayroll.findMany({
      where: { payrollMonth: month },
      orderBy: { staffCode: 'asc' }
    });

    // 5. Fetch Operational / Overhead Expense line items for the month (Facility Rent, etc.)
    const expenseLines = await prisma.operationalExpenseLine.findMany({
      where: { payrollMonth: month },
      orderBy: { createdAt: 'asc' }
    });

    // 6. Calculate Aggregated Totals
    const totalStaffSalary = payrollRecords.reduce((sum, r) => sum + r.netPayableSalary, 0);
    const totalFacilityOverhead = expenseLines.reduce((sum, e) => sum + e.amount, 0);
    const masterDisbursement = totalStaffSalary + totalFacilityOverhead;

    const approvedCount = payrollRecords.filter(r => r.directorApproved || r.status === 'DISBURSED').length;
    const acknowledgedCount = payrollRecords.filter(r => r.staffAcknowledged).length;

    return res.json({
      success: true,
      data: {
        month,
        calendarDays,
        payrollRecords,
        expenseLines,
        totals: {
          totalStaffCount: payrollRecords.length,
          totalStaffSalary: Math.round(totalStaffSalary),
          totalFacilityOverhead: Math.round(totalFacilityOverhead),
          masterDisbursement: Math.round(masterDisbursement),
          approvedCount,
          acknowledgedCount,
          isFullyDisbursed: approvedCount === payrollRecords.length && payrollRecords.length > 0
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 8: UPDATE PAYROLL LINE ITEM (LOP, WORKING DAYS, ALLOWANCES, DEDUCTIONS)
 * PUT /api/staff/payroll/:id
 */
async function updatePayrollRecord(req, res, next) {
  try {
    const { id } = req.params;
    const {
      lopDays,
      actualWorkingDays,
      allowances,
      otherDeductions,
      fixedMonthlySalary,
      paymentMode,
      paymentReference,
      notes
    } = req.body;

    const existing = await prisma.staffPayroll.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    const totalDays = existing.totalCalendarDays || 30;
    const salary = fixedMonthlySalary !== undefined ? parseFloat(fixedMonthlySalary) : existing.fixedMonthlySalary;
    const lop = lopDays !== undefined ? parseFloat(lopDays) : existing.lopDays;
    const workingDays = actualWorkingDays !== undefined ? parseInt(actualWorkingDays, 10) : existing.actualWorkingDays;
    const allow = allowances !== undefined ? parseFloat(allowances) : existing.allowances;
    const deduct = otherDeductions !== undefined ? parseFloat(otherDeductions) : existing.otherDeductions;

    // Pro-rata recalculations
    const paidDays = Math.max(0, totalDays - lop);
    const perDayRate = totalDays > 0 ? parseFloat((salary / totalDays).toFixed(2)) : 0;
    const lopDeduction = parseFloat((perDayRate * lop).toFixed(2));
    const netPayableSalary = Math.max(0, Math.round((salary - lopDeduction) + allow - deduct));

    const updated = await prisma.staffPayroll.update({
      where: { id },
      data: {
        fixedMonthlySalary: salary,
        lopDays: lop,
        paidDays,
        actualWorkingDays: workingDays,
        perDayRate,
        lopDeduction,
        allowances: allow,
        otherDeductions: deduct,
        netPayableSalary,
        ...(paymentMode && { paymentMode }),
        ...(paymentReference && { paymentReference }),
        ...(notes !== undefined && { notes })
      }
    });

    return res.json({ success: true, data: updated, message: 'Payroll details updated successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 8: MULTI-SIGNATORY APPROVAL & DIGITAL SIGNATURES
 * POST /api/staff/payroll/:id/sign
 * Roles: STAFF, SUPERVISOR, DIRECTOR
 */
async function signPayrollRecord(req, res, next) {
  try {
    const { id } = req.params;
    const { roleType, signatureData, approverName } = req.body;

    const existing = await prisma.staffPayroll.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    const updateData = {};

    if (roleType === 'STAFF') {
      updateData.staffAcknowledged = true;
      updateData.staffSignature = signatureData || 'DIGITAL_ACK_BY_EMPLOYEE';
      updateData.staffSignedAt = new Date();
      if (existing.status === 'DRAFT') {
        updateData.status = 'STAFF_ACKNOWLEDGED';
      }
    } else if (roleType === 'SUPERVISOR') {
      updateData.supervisorApproved = true;
      updateData.supervisorName = approverName || 'Dr. C. Shanthi, Pathologist';
      updateData.supervisorSignedAt = new Date();
      if (existing.status === 'DRAFT' || existing.status === 'STAFF_ACKNOWLEDGED') {
        updateData.status = 'SUPERVISOR_VERIFIED';
      }
    } else if (roleType === 'DIRECTOR') {
      updateData.directorApproved = true;
      updateData.directorName = approverName || 'Dr. Narayana Murthy, MD';
      updateData.directorSignature = signatureData || 'DIGITALLY_SEALED_DR_NARAYANA_MURTHY';
      updateData.directorSignedAt = new Date();
      updateData.status = 'DISBURSED';
      updateData.disbursedAt = new Date();
    } else {
      return res.status(400).json({ success: false, message: 'Invalid roleType. Must be STAFF, SUPERVISOR, or DIRECTOR' });
    }

    const updated = await prisma.staffPayroll.update({
      where: { id },
      data: updateData
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : (approverName || 'Director'),
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: `SIGN_PAYROLL_${roleType}`,
      module: 'FINANCE',
      recordId: updated.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { staffName: updated.staffName, month: updated.payrollMonth, roleType }
    });

    return res.json({ success: true, data: updated, message: `${roleType} sign-off recorded successfully!` });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 8: BATCH APPROVE ENTIRE MONTH'S PAYROLL AS DIRECTOR
 * POST /api/staff/payroll/batch-approve
 */
async function batchApprovePayroll(req, res, next) {
  try {
    const { month, approverName, signatureData } = req.body;
    if (!month) {
      return res.status(400).json({ success: false, message: 'Month is required' });
    }

    const directorName = approverName || 'Dr. Narayana Murthy, MD';
    const now = new Date();

    const result = await prisma.staffPayroll.updateMany({
      where: { payrollMonth: month },
      data: {
        directorApproved: true,
        directorName,
        directorSignature: signatureData || 'DIGITALLY_SEALED_DR_NARAYANA_MURTHY',
        directorSignedAt: now,
        supervisorApproved: true,
        supervisorName: 'Clinical Director & HR',
        supervisorSignedAt: now,
        status: 'DISBURSED',
        disbursedAt: now
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: directorName,
      actorRole: 'ADMIN',
      action: 'BATCH_APPROVE_PAYROLL',
      module: 'FINANCE',
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { month, approvedCount: result.count }
    });

    return res.json({ success: true, message: `Approved and disbursed all ${result.count} payroll records for ${month}!` });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 8: OPERATIONAL / OVERHEAD EXPENSES LINE ITEMS (FACILITY RENT, UTILITIES, ETC.)
 * POST /api/staff/payroll/expenses
 */
async function createExpenseLine(req, res, next) {
  try {
    const { payrollMonth, expenseName, category, vendorOrPayee, amount, paymentMethod, invoiceRef, notes } = req.body;

    if (!payrollMonth || !expenseName || !vendorOrPayee || !amount) {
      return res.status(400).json({ success: false, message: 'Month, expense name, payee, and amount are required' });
    }

    const expense = await prisma.operationalExpenseLine.create({
      data: {
        payrollMonth,
        expenseName: expenseName.trim(),
        category: category || 'Facility Rent',
        vendorOrPayee: vendorOrPayee.trim(),
        amount: parseFloat(amount),
        paymentMethod: paymentMethod || 'Bank NEFT',
        invoiceRef: invoiceRef ? invoiceRef.trim() : null,
        paymentStatus: 'APPROVED',
        approvedBy: 'Dr. Narayana Murthy, MD',
        notes: notes ? notes.trim() : null
      }
    });

    return res.status(201).json({ success: true, data: expense, message: 'Expense line item added' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/staff/payroll/expenses/:id
 */
async function deleteExpenseLine(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.operationalExpenseLine.delete({ where: { id } });
    return res.json({ success: true, message: 'Expense line item deleted' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/staff/payslip/:id/pdf or /api/staff/payroll/:id/pdf
 * Generates an official Form 16 / Salary Voucher document stream
 */
async function generatePayslipPdf(req, res, next) {
  try {
    const { id } = req.params;
    const record = await prisma.staffPayroll.findUnique({ where: { id } });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    const filename = `Payslip_${record.staffCode}_${record.payrollMonth}.pdf`;

    // Standard PDF format stream
    const pdfContent = `%PDF-1.4
1 0 obj << /Title (RITHANYA HOSPITAL OFFICIAL SALARY VOUCHER - ${record.staffName}) /Creator (Rithanya ERP) >> endobj
2 0 obj << /Type /Catalog /Pages 3 0 R >> endobj
3 0 obj << /Type /Pages /Kids [4 0 R] /Count 1 >> endobj
4 0 obj << /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >> endobj
5 0 obj << /Length 250 >> stream
BT
/F1 18 Tf
50 720 Td
(RITHANYA HOSPITAL - OFFICIAL SALARY VOUCHER) Tj
/F1 12 Tf
0 -30 Td
(Staff: ${record.staffName} [${record.staffCode}] - ${record.designation}) Tj
0 -20 Td
(Month: ${record.payrollMonth} | Net Payable: INR ${record.netPayableSalary}) Tj
0 -20 Td
(Status: ${record.status} | Mode: ${record.paymentMode || 'NEFT'}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000120 00000 n
0000000175 00000 n
0000000240 00000 n
0000000330 00000 n
trailer << /Size 6 /Root 2 0 R >>
startxref
640
%%EOF`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(Buffer.from(pdfContent));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getMonthlyPayroll,
  updatePayrollRecord,
  signPayrollRecord,
  batchApprovePayroll,
  createExpenseLine,
  deleteExpenseLine,
  generatePayslipPdf
};
