const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public
router.get('/', serviceController.getServices);
router.get('/:slug', serviceController.getServiceBySlug);

// Admin CMS
router.post('/', authenticate, requirePermission('services'), serviceController.createService);
router.put('/:id', authenticate, requirePermission('services'), serviceController.updateService);
router.delete('/:id', authenticate, requirePermission('services'), serviceController.deleteService);

module.exports = router;
