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

// Inventory overview & audit logs
router.get('/', inventoryController.getBloodInventory);
router.get('/logs', inventoryController.getInventoryLogs);
router.post('/load', inventoryController.quickLoadStock);
router.post('/dispense', inventoryController.quickDispenseStock);

// Req 6: Blood Unit Reservations
router.post('/reserve', inventoryController.reserveBloodStock);
router.post('/unreserve/:id', inventoryController.releaseReservation);
router.post('/reservations/:id/release', inventoryController.releaseReservation);
router.post('/fulfill-reservation/:id', inventoryController.fulfillReservation);
router.post('/reservations/:id/fulfill', inventoryController.fulfillReservation);

// Req 7: Blood Bag Units & Mandatory Serology Screening Pipeline
router.post('/bags', inventoryController.registerBloodBag);
router.put('/bags/:id/screen', inventoryController.screenBloodBag);

// Req 7: Empty Collection Bags & Serology Test Kit Supplies
router.put('/empty-bags/:id', inventoryController.updateEmptyBagStock);
router.put('/test-kits/:id/restock', inventoryController.restockTestKit);

module.exports = router;
