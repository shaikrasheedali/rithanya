const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requirePermission('staff'));

// Req 8: Payroll Engine & Overhead Expense Line Items (placed before /:id routes)
router.get('/payroll', staffController.getMonthlyPayroll);
router.get('/payslip/:id/pdf', staffController.generatePayslipPdf);
router.get('/payroll/:id/pdf', staffController.generatePayslipPdf);
router.put('/payroll/:id', staffController.updatePayrollRecord);
router.post('/payroll/:id/sign', staffController.signPayrollRecord);
router.post('/payroll/batch-approve', staffController.batchApprovePayroll);
router.post('/payroll/expenses', staffController.createExpenseLine);
router.delete('/payroll/expenses/:id', staffController.deleteExpenseLine);

// Staff Directory CRUD
router.get('/', staffController.getStaff);
router.post('/', staffController.createStaff);
router.put('/:id', staffController.updateStaff);
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
