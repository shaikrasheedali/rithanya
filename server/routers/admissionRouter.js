const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requirePermission('admissions'));

router.get('/', admissionController.getAdmissions);
router.post('/', admissionController.createAdmission);
router.put('/:id/discharge', admissionController.dischargeAdmission);

module.exports = router;
