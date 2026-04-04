const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

router.get('/specialists', appointmentController.getSpecialists);
router.post('/book', appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getUserAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;
