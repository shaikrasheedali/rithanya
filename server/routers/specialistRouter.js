const express = require('express');
const router = express.Router();
const specialistController = require('../controllers/specialistController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public
router.get('/', specialistController.getSpecialists);

// Admin CMS
router.post('/', authenticate, requirePermission('specialists'), specialistController.createSpecialist);
router.put('/:id', authenticate, requirePermission('specialists'), specialistController.updateSpecialist);
router.delete('/:id', authenticate, requirePermission('specialists'), specialistController.deleteSpecialist);

module.exports = router;
