const Appointment = require('../models/Appointment');
const { validateAuthToken, validateDoctorExists } = require('../services/interService');

// ── Book Appointment ──────────────────────────────────────────────────────
const bookAppointment = async (req, res) => {
  try {
    // Step 1: Validate user via Auth Service
    const user = await validateAuthToken(req.headers['authorization']);

    const { doctorId, appointmentDate, timeSlot, reason } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'doctorId, appointmentDate and timeSlot are required',
      });
    }

    // Step 2: Validate doctor via Doctor Service
    const doctor = await validateDoctorExists(doctorId);

    // Step 3: Check for duplicate booking
    const existingAppointment = await Appointment.findOne({
      patientId: user.id,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'You already have an appointment with this doctor at that time',
      });
    }

    // Step 4: Create appointment
    const appointment = await Appointment.create({
      patientId: user.id,
      patientEmail: user.email,
      doctorId,
      doctorName: doctor.fullName,
      specialization: doctor.specialization,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('[Appointment] Book error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ── Get My Appointments ───────────────────────────────────────────────────
const getMyAppointments = async (req, res) => {
  try {
    // Validate user via Auth Service — extracts userId from JWT
    const user = await validateAuthToken(req.headers['authorization']);

    const appointments = await Appointment.find({ patientId: user.id }).sort({
      appointmentDate: -1,
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('[Appointment] GetMine error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ── Cancel Appointment ────────────────────────────────────────────────────
const cancelAppointment = async (req, res) => {
  try {
    const user = await validateAuthToken(req.headers['authorization']);

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Only the owning patient can cancel
    if (appointment.patientId !== user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error('[Appointment] Cancel error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { bookAppointment, getMyAppointments, cancelAppointment };
