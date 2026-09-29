const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requirePermission('finance'));

// Consolidated Financial Outflow & Ledger
router.get('/', financeController.getExpenses);
router.post('/', financeController.createExpense);

// Universal Multi-Level Approval & Disbursement Pipeline (placed before /:id routes)
router.post('/batch-approve', financeController.batchApproveFinancialQueue);
router.post('/approve/:id', financeController.approveFinancialItem);

// Expense record CRUD
router.put('/:id', financeController.updateExpense);
router.delete('/:id', financeController.deleteExpense);

module.exports = router;
