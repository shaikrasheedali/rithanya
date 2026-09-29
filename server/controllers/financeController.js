const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

// Validated Expense Categories (supporting legacy and expanded hospital taxonomy)
const VALID_EXPENSE_CATEGORIES = [
  'Medical supplies',
  'Medical Supplies & Reagents',
  'Clinical operations',
  'Clinical Operations & Consumables',
  'Utilities',
  'Utilities & Power',
  'Compliance',
  'Regulatory & Compliance',
  'Facility Rent',
  'Equipment AMC Maintenance',
  'Equipment AMC & Maintenance',
  'Biomedical Waste Disposal',
  'Other Operational Overhead'
];

/**
 * REQ 4: CONSOLIDATED FINANCIAL OUTFLOW DASHBOARD
 * GET /api/finance?month=YYYY-MM&category=...&status=...
 * Aggregates:
 * 1. Staff Payroll Total for the month (from StaffPayroll)
 * 2. Facility Rent & Recurring Overheads
 * 3. Categorized Vendor Expenses (Medical Supplies, Utilities, Compliance, etc.)
 * 4. Universal Approval & Disbursement Queue
 */
async function getExpenses(req, res, next) {
  try {
    const { category, status, approvalStage } = req.query;
    const month = req.query.month || new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    // 1. Fetch Expenses from Database with safe soft degradation
    let expenses = [];
    let hasDegraded = false;
    let diagnosticWarning = null;
    try {
      expenses = await prisma.expense.findMany({
        where: {
          ...(category && { category }),
          ...(status && { status }),
          ...(approvalStage && { approvalStage })
        },
        orderBy: { date: 'desc' }
      });
    } catch (expErr) {
      hasDegraded = true;
      diagnosticWarning = `Expense table query note: ${expErr.message}`;
      console.warn('[Finance Soft Degradation]', diagnosticWarning);
      expenses = [];
    }

    // 2. Fetch Staff Payroll records for this month with safe fallback
    let payrollRecords = [];
    try {
      payrollRecords = await prisma.staffPayroll.findMany({
        where: { payrollMonth: month }
      });
    } catch (payErr) {
      hasDegraded = true;
      diagnosticWarning = (diagnosticWarning ? diagnosticWarning + '; ' : '') + `StaffPayroll table query note: ${payErr.message}`;
      console.warn('[Finance Soft Degradation]', payErr.message);
      payrollRecords = [];
    }

    const totalStaffPayroll = payrollRecords.reduce((sum, r) => sum + r.netPayableSalary, 0);
    const payrollApprovedCount = payrollRecords.filter((r) => r.directorApproved || r.status === 'DISBURSED').length;
    const isPayrollFullyDisbursed = payrollRecords.length > 0 && payrollApprovedCount === payrollRecords.length;

    // 3. Filter expenses relevant to the selected month
    const monthExpenses = expenses.filter((e) => {
      const expMonth = new Date(e.date).toISOString().slice(0, 7);
      return expMonth === month;
    });

    // 4. Compute Category Outflows for the month
    const categorySummary = {};
    for (const cat of VALID_EXPENSE_CATEGORIES) {
      categorySummary[cat] = 0;
    }

    // Add payroll as a category in master financial outflow
    categorySummary['Staff Payroll'] = Math.round(totalStaffPayroll);

    let totalFacilityRent = 0;
    let totalVendorExpenses = 0;

    monthExpenses.forEach((exp) => {
      categorySummary[exp.category] = (categorySummary[exp.category] || 0) + exp.amount;
      if (exp.category === 'Facility Rent') {
        totalFacilityRent += exp.amount;
      } else {
        totalVendorExpenses += exp.amount;
      }
    });

    // Master Consolidated Hospital Outflow
    const masterDisbursement = Math.round(totalStaffPayroll + totalFacilityRent + totalVendorExpenses);

    // 5. Universal Multi-Level Approval Queue
    // Collects both pending vendor expenses AND the monthly payroll batch release
    const pendingExpenses = expenses.filter((e) => e.approvalStage !== 'DISBURSED' && e.status !== 'paid');

    const approvalQueue = [
      // If payroll for this month has pending approvals, include the payroll batch item
      ...(!isPayrollFullyDisbursed && payrollRecords.length > 0
        ? [
            {
              id: `PAYROLL-BATCH-${month}`,
              itemType: 'PAYROLL_BATCH',
              title: `Monthly Staff Payroll Release (${month})`,
              category: 'Staff Payroll',
              payee: `${payrollRecords.length} Hospital Staff Members`,
              amount: Math.round(totalStaffPayroll),
              date: new Date(),
              approvalStage: payrollApprovedCount > 0 ? 'SUPERVISOR_VERIFIED' : 'PENDING_REVIEW',
              supervisorApproved: payrollApprovedCount > 0,
              supervisorName: 'HR & Clinical Supervisor',
              directorApproved: false,
              directorName: 'Dr. Narayana Murthy, MD',
              reference: `PR-${month}-BATCH`,
              notes: 'Monthly pro-rata salary disbursement batch awaiting executive director seal'
            }
          ]
        : []),
      ...pendingExpenses.map((exp) => ({
        id: exp.id,
        itemType: 'VENDOR_EXPENSE',
        title: exp.name,
        category: exp.category,
        payee: exp.vendor,
        amount: exp.amount,
        date: exp.date,
        approvalStage: exp.approvalStage,
        supervisorApproved: exp.supervisorApproved,
        supervisorName: exp.supervisorName,
        directorApproved: exp.directorApproved,
        directorName: exp.directorName,
        reference: exp.expenseCode || exp.invoiceRef,
        notes: exp.notes
      }))
    ];

    const activeExpenses = monthExpenses.length > 0 ? monthExpenses : expenses;
    const facilityRentExpenses = activeExpenses.filter((e) => e.category === 'Facility Rent');
    const vendorExpenses = activeExpenses.filter((e) => e.category !== 'Facility Rent');
    const calculatedTotalOutflow = Math.round(totalStaffPayroll + totalFacilityRent + totalVendorExpenses);

    const kpiData = {
      totalOutflow: calculatedTotalOutflow,
      payrollOutflow: Math.round(totalStaffPayroll),
      rentOutflow: Math.round(totalFacilityRent),
      vendorOutflow: Math.round(totalVendorExpenses),
      totalStaffCount: payrollRecords.length,
      pendingApprovalCount: approvalQueue.length
    };

    return res.json({
      success: true,
      ...(hasDegraded && {
        degraded: true,
        diagnosticWarning
      }),
      data: {
        month,
        expenses: activeExpenses,
        allExpenses: expenses,
        facilityRentExpenses,
        vendorExpenses,
        categorySummary,
        kpis: kpiData,
        totals: {
          masterDisbursement: calculatedTotalOutflow,
          totalStaffPayroll: Math.round(totalStaffPayroll),
          totalFacilityRent: Math.round(totalFacilityRent),
          totalVendorExpenses: Math.round(totalVendorExpenses),
          pendingApprovalCount: approvalQueue.length
        },
        payrollSummary: {
          payrollMonth: month,
          totalAmount: Math.round(totalStaffPayroll),
          staffCount: payrollRecords.length,
          approvedCount: payrollApprovedCount,
          isFullyDisbursed: isPayrollFullyDisbursed
        },
        approvalQueue
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 5: STRICT EXPENSE SCHEMA & INPUT VALIDATION ENGINE
 * POST /api/finance
 */
async function createExpense(req, res, next) {
  try {
    const {
      name,
      category,
      vendor,
      amount,
      date,
      paymentMethod,
      invoiceRef,
      receiptUrl,
      notes
    } = req.body;

    // 1. Strict validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Expense description / name is required' });
    }

    if (!category || !VALID_EXPENSE_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${VALID_EXPENSE_CATEGORIES.join(', ')}`
      });
    }

    if (!vendor || typeof vendor !== 'string' || !vendor.trim()) {
      return res.status(400).json({ success: false, message: 'Vendor / Payee name is required' });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number greater than 0' });
    }

    if (numAmount > 10000000) {
      return res.status(400).json({ success: false, message: 'Amount exceeds maximum permitted single transaction limit (₹1 Crore)' });
    }

    // 2. Generate unique expense code
    const uniqueSuffix = `${Date.now().toString().slice(-5)}${Math.floor(10 + Math.random() * 90)}`;
    const expenseCode = `EXP-${uniqueSuffix}`;

    // 3. Create Expense Record
    const expense = await prisma.expense.create({
      data: {
        expenseCode,
        name: name.trim().slice(0, 191),
        category,
        vendor: vendor.trim().slice(0, 191),
        amount: numAmount,
        date: date ? new Date(date) : new Date(),
        paymentMethod: paymentMethod || 'Bank NEFT',
        invoiceRef: invoiceRef ? invoiceRef.trim().slice(0, 191) : null,
        receiptUrl: receiptUrl ? receiptUrl.trim() : null,
        approvalStage: 'PENDING_REVIEW',
        status: 'pending',
        notes: notes ? notes.trim() : null
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'ADD_EXPENSE',
      module: 'FINANCE',
      recordId: expense.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { expenseCode, amount: expense.amount, category, vendor: expense.vendor }
    });

    return res.status(201).json({
      success: true,
      data: expense,
      message: `Expense ${expenseCode} registered and queued for supervisor verification`
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/finance/:id
 */
async function updateExpense(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      vendor,
      amount,
      date,
      paymentMethod,
      invoiceRef,
      receiptUrl,
      notes,
      status
    } = req.body;

    const data = {};
    if (name) data.name = name.trim().slice(0, 191);
    if (category && VALID_EXPENSE_CATEGORIES.includes(category)) data.category = category;
    if (vendor) data.vendor = vendor.trim().slice(0, 191);
    if (amount !== undefined) {
      const num = parseFloat(amount);
      if (num <= 0 || num > 10000000) {
        return res.status(400).json({ success: false, message: 'Invalid expense amount' });
      }
      data.amount = num;
    }
    if (date) data.date = new Date(date);
    if (paymentMethod) data.paymentMethod = paymentMethod;
    if (invoiceRef !== undefined) data.invoiceRef = invoiceRef ? invoiceRef.trim() : null;
    if (receiptUrl !== undefined) data.receiptUrl = receiptUrl ? receiptUrl.trim() : null;
    if (notes !== undefined) data.notes = notes ? notes.trim() : null;
    if (status) data.status = status;

    const expense = await prisma.expense.update({
      where: { id },
      data
    });

    return res.json({ success: true, data: expense, message: 'Expense details updated' });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/finance/:id
 */
async function deleteExpense(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.expense.delete({ where: { id } });
    return res.json({ success: true, message: 'Expense record deleted' });
  } catch (err) {
    next(err);
  }
}

/**
 * REQ 6: UNIVERSAL MULTI-LEVEL APPROVAL & DISBURSEMENT PIPELINE
 * POST /api/finance/approve/:id
 * Handles both Vendor Invoices and Monthly Payroll Batch releases
 */
async function approveFinancialItem(req, res, next) {
  try {
    const { id } = req.params;
    const { roleType, approverName, notes } = req.body;

    if (!['SUPERVISOR', 'DIRECTOR'].includes(roleType)) {
      return res.status(400).json({ success: false, message: 'Role must be SUPERVISOR or DIRECTOR' });
    }

    const now = new Date();

    // 1. Check if approving a Payroll Batch Item
    if (id.startsWith('PAYROLL-BATCH-')) {
      const month = id.replace('PAYROLL-BATCH-', '');

      if (roleType === 'SUPERVISOR') {
        await prisma.staffPayroll.updateMany({
          where: { payrollMonth: month },
          data: {
            supervisorApproved: true,
            supervisorName: approverName || 'Dr. C. Shanthi, Pathologist',
            supervisorSignedAt: now
          }
        });
        return res.json({
          success: true,
          item: {
            id,
            payrollMonth: month,
            supervisorApproved: true,
            supervisorName: approverName || 'Dr. C. Shanthi, Pathologist',
            supervisorSignedAt: now
          },
          message: `Supervisor audit verification completed for ${month} Payroll Batch!`
        });
      }

      if (roleType === 'DIRECTOR') {
        const result = await prisma.staffPayroll.updateMany({
          where: { payrollMonth: month },
          data: {
            supervisorApproved: true,
            supervisorName: 'HR & Clinical Supervisor',
            supervisorSignedAt: now,
            directorApproved: true,
            directorName: approverName || 'Dr. Narayana Murthy, MD',
            directorSignature: 'DIGITALLY_SEALED_DR_NARAYANA_MURTHY',
            directorSignedAt: now,
            status: 'DISBURSED',
            disbursedAt: now
          }
        });

        recordAuditLog({
          actorId: req.user ? req.user.id : null,
          actorName: approverName || 'Dr. Narayana Murthy, MD',
          actorRole: 'ADMIN',
          action: 'DISBURSE_PAYROLL_BATCH',
          module: 'FINANCE',
          details: { month, count: result.count }
        });

        return res.json({
          success: true,
          item: {
            id,
            payrollMonth: month,
            supervisorApproved: true,
            directorApproved: true,
            directorName: approverName || 'Dr. Narayana Murthy, MD',
            directorSignedAt: now,
            status: 'DISBURSED'
          },
          message: `Executive Director Seal applied. Disbursed ${result.count} salaries for ${month}!`
        });
      }
    }

    // 2. Standard Vendor Expense Approval
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found' });
    }

    const updateData = {};

    if (roleType === 'SUPERVISOR') {
      updateData.supervisorApproved = true;
      updateData.supervisorName = approverName || 'Dr. C. Shanthi, Pathologist';
      updateData.supervisorSignedAt = now;
      updateData.approvalStage = 'SUPERVISOR_VERIFIED';
    } else if (roleType === 'DIRECTOR') {
      updateData.supervisorApproved = true;
      if (!expense.supervisorName) updateData.supervisorName = 'Clinical Finance Supervisor';
      if (!expense.supervisorSignedAt) updateData.supervisorSignedAt = now;
      updateData.directorApproved = true;
      updateData.directorName = approverName || 'Dr. Narayana Murthy, MD';
      updateData.directorSignedAt = now;
      updateData.approvalStage = 'DISBURSED';
      updateData.status = 'paid';
    }

    if (notes) {
      updateData.notes = expense.notes ? `${expense.notes} | Audit: ${notes}` : notes;
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: updateData
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: approverName || 'Director',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: `APPROVE_EXPENSE_${roleType}`,
      module: 'FINANCE',
      recordId: updated.id,
      details: { expenseCode: updated.expenseCode, roleType, stage: updated.approvalStage }
    });

    return res.json({
      success: true,
      data: updated,
      item: updated,
      message: `${roleType} approval recorded for ${updated.name} (${updated.expenseCode})`
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/finance/batch-approve
 * Batch approves all pending queue items as Director or Supervisor
 */
async function batchApproveFinancialQueue(req, res, next) {
  try {
    const { roleType, approverName, month } = req.body;
    const now = new Date();
    const effectiveMonth = month || new Date().toISOString().slice(0, 7);

    // 1. Approve Payroll batch
    await prisma.staffPayroll.updateMany({
      where: { payrollMonth: effectiveMonth },
      data: {
        supervisorApproved: true,
        supervisorName: 'HR & Clinical Supervisor',
        supervisorSignedAt: now,
        ...(roleType === 'DIRECTOR' && {
          directorApproved: true,
          directorName: approverName || 'Dr. Narayana Murthy, MD',
          directorSignature: 'DIGITALLY_SEALED_DR_NARAYANA_MURTHY',
          directorSignedAt: now,
          status: 'DISBURSED',
          disbursedAt: now
        })
      }
    });

    // 2. Approve all pending expenses
    if (roleType === 'DIRECTOR') {
      await prisma.expense.updateMany({
        where: {
          status: 'pending'
        },
        data: {
          supervisorApproved: true,
          supervisorName: 'Clinical Supervisor',
          supervisorSignedAt: now,
          directorApproved: true,
          directorName: approverName || 'Dr. Narayana Murthy, MD',
          directorSignedAt: now,
          approvalStage: 'DISBURSED',
          status: 'paid'
        }
      });
    } else {
      await prisma.expense.updateMany({
        where: {
          approvalStage: 'PENDING_REVIEW'
        },
        data: {
          supervisorApproved: true,
          supervisorName: approverName || 'Dr. C. Shanthi, Pathologist',
          supervisorSignedAt: now,
          approvalStage: 'SUPERVISOR_VERIFIED'
        }
      });
    }

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: approverName || 'Director',
      actorRole: 'ADMIN',
      action: `BATCH_APPROVE_FINANCE_${roleType}`,
      module: 'FINANCE',
      details: { roleType, month: effectiveMonth }
    });

    return res.json({
      success: true,
      message: `Batch ${roleType} authorization complete across all pending payroll and vendor invoices!`
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  approveFinancialItem,
  batchApproveFinancialQueue
};
