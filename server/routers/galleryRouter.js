const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public
router.get('/', galleryController.getGallery);

// Admin CMS
router.post('/', authenticate, requirePermission('gallery'), galleryController.createGalleryItem);
router.put('/:id', authenticate, requirePermission('gallery'), galleryController.updateGalleryItem);
router.delete('/:id', authenticate, requirePermission('gallery'), galleryController.deleteGalleryItem);

module.exports = router;
