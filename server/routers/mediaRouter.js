const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middlewares/uploadMiddleware');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requirePermission('media'));

router.get('/', mediaController.getMediaAssets);
router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
