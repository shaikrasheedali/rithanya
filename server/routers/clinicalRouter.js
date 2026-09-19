const express = require('express');
const router = express.Router();
const clinicalController = require('../controllers/clinicalController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

router.use(authenticate);
router.use(requirePermission('clinical'));

router.get('/', clinicalController.getClinicalReadings);
router.post('/', clinicalController.createClinicalReading);
router.put('/:id', clinicalController.updateClinicalReading);
router.delete('/:id', clinicalController.deleteClinicalReading);

module.exports = router;
