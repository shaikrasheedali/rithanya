const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requireRoles } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requireRoles('SUPERADMIN', 'ADMIN'));

router.get('/', credentialController.getCredentials);
router.post('/', credentialController.createCredential);
router.put('/:id/permissions', credentialController.updatePermissions);
router.put('/:id/reset-password', credentialController.resetPassword);
router.delete('/:id', credentialController.deleteCredential);

module.exports = router;
