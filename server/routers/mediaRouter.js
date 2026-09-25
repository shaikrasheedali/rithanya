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

// Media asset listing available to all authenticated staff/admins for modal re-use
router.get('/', mediaController.getMediaAssets);
router.get('/assets', mediaController.getMediaAssets);

// Asset deletion requires explicit media permission or admin role
router.delete('/:id', requirePermission('media'), mediaController.deleteMedia);

module.exports = router;
