const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public blood availability endpoint for Homepage and public viewing
router.get('/public', inventoryController.getPublicBloodStock);

// Protected staff/admin operations
router.use(authenticate);
router.use(requirePermission('inventory'));

router.get('/', inventoryController.getBloodInventory);
router.post('/load', inventoryController.quickLoadStock);
router.post('/dispense', inventoryController.quickDispenseStock);
router.get('/logs', inventoryController.getInventoryLogs);

module.exports = router;
