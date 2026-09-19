const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getClinicalReadings(req, res, next) {
  try {
    const { patientId, admissionId, limit } = req.query;

    const where = {
      ...(patientId && { patientId }),
      ...(admissionId && { admissionId })
    };

    const readings = await prisma.clinicalReading.findMany({
      where,
      include: {
        patient: {
          select: { id: true, patientCode: true, name: true, bloodGroup: true, condition: true }
        },
        admission: {
          select: { id: true, admissionCode: true, ward: true, bed: true }
        }
      },
      orderBy: { date: 'desc' },
      ...(limit && { take: parseInt(limit, 10) })
    });

    return res.json({ success: true, data: readings });
  } catch (err) {
    next(err);
  }
}

async function createClinicalReading(req, res, next) {
  try {
    const {
      patientId,
      admissionId,
      date,
      time,
      timeSlot,
      bloodSugarFasting,
      bloodSugarPP,
      bloodSugarRandom,
      hba1c,
      bpSystolic,
      bpDiastolic,
      haemoglobin,
      ferritin,
      spo2,
      temperature,
      pulse,
      notes
    } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, message: 'patientId is required' });
    }

    const reading = await prisma.clinicalReading.create({
      data: {
        patientId,
        admissionId: admissionId || null,
        date: date ? new Date(date) : new Date(),
        time: time || '11:00 AM',
        timeSlot: timeSlot || 'Morning',
        bloodSugarFasting: bloodSugarFasting ? parseFloat(bloodSugarFasting) : null,
        bloodSugarPP: bloodSugarPP ? parseFloat(bloodSugarPP) : null,
        bloodSugarRandom: bloodSugarRandom ? parseFloat(bloodSugarRandom) : null,
        hba1c: hba1c ? parseFloat(hba1c) : null,
        bpSystolic: bpSystolic ? parseInt(bpSystolic, 10) : null,
        bpDiastolic: bpDiastolic ? parseInt(bpDiastolic, 10) : null,
        haemoglobin: haemoglobin ? parseFloat(haemoglobin) : null,
        ferritin: ferritin ? parseFloat(ferritin) : null,
        spo2: spo2 ? parseInt(spo2, 10) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        pulse: pulse ? parseInt(pulse, 10) : null,
        notes: notes || null,
        recordedBy: req.user ? req.user.name : 'Dr. Narayana Murthy'
      },
      include: {
        patient: { select: { patientCode: true, name: true } }
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'RECORD_CLINICAL_VITALS',
      module: 'CLINICAL',
      recordId: reading.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { patientCode: reading.patient.patientCode, readingId: reading.id }
    });

    return res.status(201).json({ success: true, data: reading });
  } catch (err) {
    next(err);
  }
}

async function updateClinicalReading(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    delete updateData.id;
    delete updateData.patientId;

    if (updateData.date) updateData.date = new Date(updateData.date);
    if (updateData.bloodSugarFasting) updateData.bloodSugarFasting = parseFloat(updateData.bloodSugarFasting);
    if (updateData.bloodSugarPP) updateData.bloodSugarPP = parseFloat(updateData.bloodSugarPP);
    if (updateData.bloodSugarRandom) updateData.bloodSugarRandom = parseFloat(updateData.bloodSugarRandom);
    if (updateData.hba1c) updateData.hba1c = parseFloat(updateData.hba1c);
    if (updateData.bpSystolic) updateData.bpSystolic = parseInt(updateData.bpSystolic, 10);
    if (updateData.bpDiastolic) updateData.bpDiastolic = parseInt(updateData.bpDiastolic, 10);
    if (updateData.haemoglobin) updateData.haemoglobin = parseFloat(updateData.haemoglobin);
    if (updateData.ferritin) updateData.ferritin = parseFloat(updateData.ferritin);
    if (updateData.spo2) updateData.spo2 = parseInt(updateData.spo2, 10);
    if (updateData.temperature) updateData.temperature = parseFloat(updateData.temperature);
    if (updateData.pulse) updateData.pulse = parseInt(updateData.pulse, 10);

    const updated = await prisma.clinicalReading.update({
      where: { id },
      data: updateData
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteClinicalReading(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.clinicalReading.delete({ where: { id } });
    return res.json({ success: true, message: 'Clinical reading deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getClinicalReadings,
  createClinicalReading,
  updateClinicalReading,
  deleteClinicalReading
};
