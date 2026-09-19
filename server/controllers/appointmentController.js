const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getAppointments(req, res, next) {
  try {
    const { status, date, search } = req.query;

    const where = {
      ...(status && { status })
    };

    if (search) {
      where.OR = [
        { patientName: { contains: search } },
        { phone: { contains: search } },
        { apptCode: { contains: search } }
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { preferredDate: 'asc' }
    });

    return res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
}

async function createAppointment(req, res, next) {
  try {
    const {
      patientName,
      phone,
      email,
      age,
      gender,
      bloodGroup,
      specialty,
      doctorName,
      preferredDate,
      preferredTimeSlot,
      reason
    } = req.body;

    if (!patientName || !phone || !preferredDate) {
      return res.status(400).json({ success: false, message: 'Patient name, phone, and preferred date are required' });
    }

    const count = await prisma.appointment.count();
    const apptCode = `APT-${1000 + count + 1}`;

    const appointment = await prisma.appointment.create({
      data: {
        apptCode,
        patientName: patientName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        age: age ? parseInt(age, 10) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        specialty: specialty || 'General Medicine & Diabetology',
        doctorName: doctorName || 'Dr. Narayana Murthy, MD',
        preferredDate: new Date(preferredDate),
        preferredTimeSlot: preferredTimeSlot || 'Morning (10:00 AM - 01:00 PM)',
        reason: reason ? reason.trim() : null,
        status: 'pending'
      }
    });

    recordAuditLog({
      actorName: patientName,
      actorRole: 'PUBLIC',
      action: 'BOOK_APPOINTMENT',
      module: 'APPOINTMENTS',
      recordId: appointment.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { apptCode, phone, specialty }
    });

    return res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully. Keep your appointment code for tracking.'
    });
  } catch (err) {
    next(err);
  }
}

async function getAppointmentByCode(req, res, next) {
  try {
    const { code } = req.params;
    const appointment = await prisma.appointment.findFirst({
      where: {
        OR: [{ apptCode: code }, { id: code }]
      }
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes, preferredDate, preferredTimeSlot } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(preferredDate && { preferredDate: new Date(preferredDate) }),
        ...(preferredTimeSlot && { preferredTimeSlot })
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'UPDATE_APPOINTMENT_STATUS',
      module: 'APPOINTMENTS',
      recordId: appointment.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { apptCode: appointment.apptCode, status }
    });

    return res.json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAppointments,
  createAppointment,
  getAppointmentByCode,
  updateAppointmentStatus
};
