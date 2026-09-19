const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission, requireRoles } = require('../middlewares/rbacMiddleware');

// Public settings (hospital info, contact, timings)
router.get('/', settingsController.getSettings);

// Admin update settings
router.put('/:key', authenticate, requireRoles('SUPERADMIN', 'ADMIN'), settingsController.updateSetting);

// System backup export
router.get('/backup/export', authenticate, requireRoles('SUPERADMIN'), settingsController.exportBackup);

module.exports = router;
