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

    const safeFloat = (v) => {
      if (v === null || v === undefined || v === '') return null;
      const num = parseFloat(v);
      return isNaN(num) ? null : num;
    };

    const safeInt = (v) => {
      if (v === null || v === undefined || v === '') return null;
      const num = parseInt(v, 10);
      return isNaN(num) ? null : num;
    };

    const hbVal = safeFloat(haemoglobin);
    if (hbVal !== null && (hbVal < 0 || hbVal > 30)) {
      return res.status(400).json({ success: false, message: 'Haemoglobin value must be between 0 and 30 g/dL' });
    }

    const spo2Val = safeInt(spo2);
    if (spo2Val !== null && (spo2Val < 20 || spo2Val > 100)) {
      return res.status(400).json({ success: false, message: 'SpO2 oxygen saturation must be between 20% and 100%' });
    }

    const pulseVal = safeInt(pulse);
    if (pulseVal !== null && (pulseVal < 20 || pulseVal > 300)) {
      return res.status(400).json({ success: false, message: 'Pulse rate must be between 20 and 300 bpm' });
    }

    const sysVal = safeInt(bpSystolic);
    if (sysVal !== null && (sysVal < 40 || sysVal > 350)) {
      return res.status(400).json({ success: false, message: 'Systolic blood pressure must be between 40 and 350 mmHg' });
    }

    const diaVal = safeInt(bpDiastolic);
    if (diaVal !== null && (diaVal < 20 || diaVal > 250)) {
      return res.status(400).json({ success: false, message: 'Diastolic blood pressure must be between 20 and 250 mmHg' });
    }

    const reading = await prisma.clinicalReading.create({
      data: {
        patientId,
        admissionId: admissionId || null,
        date: date ? new Date(date) : new Date(),
        time: time || '11:00 AM',
        timeSlot: timeSlot || 'Morning',
        bloodSugarFasting: safeFloat(bloodSugarFasting),
        bloodSugarPP: safeFloat(bloodSugarPP),
        bloodSugarRandom: safeFloat(bloodSugarRandom),
        hba1c: safeFloat(hba1c),
        bpSystolic: sysVal,
        bpDiastolic: diaVal,
        haemoglobin: hbVal,
        ferritin: safeFloat(ferritin),
        spo2: spo2Val,
        temperature: safeFloat(temperature),
        pulse: pulseVal,
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
    const existing = await prisma.clinicalReading.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Clinical reading not found or already removed' });
    }
    await prisma.clinicalReading.delete({ where: { id } });
    return res.json({ success: true, message: 'Clinical reading deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Clinical reading not found or already removed' });
    }
    next(err);
  }
}

module.exports = {
  getClinicalReadings,
  createClinicalReading,
  updateClinicalReading,
  deleteClinicalReading
};
