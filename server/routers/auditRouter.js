const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRoles } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requireRoles('SUPERADMIN', 'ADMIN'));

router.get('/', auditController.getAuditLogs);

module.exports = router;
