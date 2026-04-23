const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');

router.post('/', bookAppointment);
router.get('/me', getMyAppointments);
router.patch('/:id/cancel', cancelAppointment);

module.exports = router;
