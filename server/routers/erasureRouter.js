const express = require('express');
const router = express.Router();
const erasureController = require('../controllers/erasureController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRoles } = require('../middlewares/rbacMiddleware');

// Public DPDP Request submission
router.post('/request', erasureController.submitErasureRequest);

// Admin review and one-click cascading purge
router.get('/requests', authenticate, requireRoles('SUPERADMIN', 'ADMIN'), erasureController.getErasureRequests);
router.post('/requests/:id/approve', authenticate, requireRoles('SUPERADMIN', 'ADMIN'), erasureController.approveAndPurge);
router.post('/requests/:id/reject', authenticate, requireRoles('SUPERADMIN', 'ADMIN'), erasureController.rejectErasureRequest);

module.exports = router;
