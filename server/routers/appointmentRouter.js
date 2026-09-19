const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticate } = require('../middlewares/authMiddleware');
const { requirePermission } = require('../middlewares/rbacMiddleware');

// Public routes
router.post('/book', appointmentController.createAppointment);
router.get('/track/:code', appointmentController.getAppointmentByCode);

// Protected routes
router.get('/', authenticate, requirePermission('appointments'), appointmentController.getAppointments);
router.put('/:id/status', authenticate, requirePermission('appointments'), appointmentController.updateAppointmentStatus);

module.exports = router;
