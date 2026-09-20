const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public checkout / inquiry submission
router.post('/', inquiryController.createOrder);
router.post('/checkout', inquiryController.createOrder);

// Admin / Staff with orders/inquiries permission
router.get('/', authenticate, inquiryController.getInquiries);
router.put('/:id/status', authenticate, inquiryController.updateInquiryStatus);
router.delete('/:id', authenticate, inquiryController.deleteInquiry);

module.exports = router;
