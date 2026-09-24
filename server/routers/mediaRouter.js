const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);

// Upload endpoints available to all authenticated users for doctor, blog, and service forms
router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.post('/', upload.single('file'), mediaController.uploadMedia);

// Asset management and deletion require explicit media permission or admin role
router.get('/', requirePermission('media'), mediaController.getMediaAssets);
router.delete('/:id', requirePermission('media'), mediaController.deleteMedia);

module.exports = router;
