const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public
router.post('/', inquiryController.createInquiry);

// Admin
router.get('/', authenticate, requirePermission('productInquiries'), inquiryController.getInquiries);
router.put('/:id/status', authenticate, requirePermission('productInquiries'), inquiryController.updateInquiryStatus);
router.delete('/:id', authenticate, requirePermission('productInquiries'), inquiryController.deleteInquiry);

module.exports = router;
