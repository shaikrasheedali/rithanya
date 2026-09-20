const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission, requireRoles } = require('../middlewares/rbacMiddleware');

router.use(authenticate);

router.get('/', requirePermission('patients'), patientController.getPatients);
router.get('/:id', requirePermission('patients'), patientController.getPatientById);
router.post('/', requirePermission('patients'), patientController.createPatient);
router.put('/:id', requirePermission('patients'), patientController.updatePatient);

// DPDP Act: Digital Camera Consent Signature Upload
router.post('/:id/consent-photo', requirePermission('patients'), patientController.captureConsentPhoto);

// Outpatient to Inpatient conversion
router.post('/:id/convert-to-inpatient', requirePermission('admissions'), patientController.convertToInpatient);

// DPDP Act: Right to Erasure / Cascading Purge (Admins & Superadmin only)
router.delete('/:id/purge', requireRoles('SUPERADMIN', 'ADMIN'), patientController.purgePatientData);

module.exports = router;
