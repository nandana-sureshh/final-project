const express = require('express');
const router = express.Router();
const { addDoctor, getDoctors, getDoctorById } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addDoctor);
router.get('/', getDoctors);
router.get('/:id', getDoctorById); // public + inter-service

module.exports = router;
