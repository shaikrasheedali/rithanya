const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public endpoints
router.get('/', treatmentController.getTreatments);
router.get('/:slug', treatmentController.getTreatmentBySlug);

// Protected Admin/Staff endpoints
router.post('/', verifyToken, requirePermission('treatments'), treatmentController.createTreatment);
router.put('/:id', verifyToken, requirePermission('treatments'), treatmentController.updateTreatment);
router.delete('/:id', verifyToken, requirePermission('treatments'), treatmentController.deleteTreatment);

module.exports = router;
