const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requirePermission('finance'));

router.get('/', financeController.getExpenses);
router.post('/', financeController.createExpense);
router.put('/:id', financeController.updateExpense);
router.delete('/:id', financeController.deleteExpense);

module.exports = router;
