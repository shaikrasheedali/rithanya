const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public
router.get('/', productController.getPackages);
router.get('/:slugOrId', productController.getPackageBySlugOrId);

// Admin CMS
router.post('/', authenticate, requirePermission('products'), productController.createPackage);
router.put('/:id', authenticate, requirePermission('products'), productController.updatePackage);
router.delete('/:id', authenticate, requirePermission('products'), productController.deletePackage);

module.exports = router;
