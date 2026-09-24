const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getAdmissions(req, res, next) {
  try {
    const { status, patientId } = req.query;

    const admissions = await prisma.admission.findMany({
      where: {
        ...(status && { status }),
        ...(patientId && { patientId })
      },
      include: {
        patient: {
          select: { id: true, patientCode: true, name: true, bloodGroup: true, condition: true, phone: true }
        },
        readings: {
          orderBy: { date: 'desc' },
          take: 5
        }
      },
      orderBy: { admittedOn: 'desc' }
    });

    return res.json({ success: true, data: admissions });
  } catch (err) {
    next(err);
  }
}

async function createAdmission(req, res, next) {
  try {
    const { patientId, ward, bed, attendingDoctor, diagnosis } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ success: false, message: 'patientId and diagnosis are required' });
    }

    const admission = await prisma.$transaction(async (tx) => {
      const count = await tx.admission.count();
      let admissionCode = `ADM-${900 + count + 1}`;
      const existingAdm = await tx.admission.findUnique({ where: { admissionCode } });
      if (existingAdm) {
        admissionCode = `ADM-${900 + count + 1}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const created = await tx.admission.create({
        data: {
          admissionCode,
          patientId,
          ward: ward || 'Daycare Transfusion Ward',
          bed: bed || 'Bed-01',
          attendingDoctor: attendingDoctor || 'Dr. Narayana Murthy, MD',
          diagnosis: diagnosis.trim(),
          status: 'admitted',
          admittedOn: new Date()
        },
        include: {
          patient: { select: { patientCode: true, name: true } }
        }
      });

      // Atomically update patient status to 'admitted'
      await tx.patient.update({
        where: { id: patientId },
        data: { status: 'admitted' }
      });

      return created;
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'CREATE_ADMISSION',
      module: 'ADMISSIONS',
      recordId: admission.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { admissionCode: admission.admissionCode, patient: admission.patient.name }
    });

    return res.status(201).json({ success: true, data: admission });
  } catch (err) {
    next(err);
  }
}

async function dischargeAdmission(req, res, next) {
  try {
    const { id } = req.params;
    const { dischargeSummary } = req.body;

    const admission = await prisma.admission.update({
      where: { id },
      data: {
        status: 'discharged',
        dischargedOn: new Date(),
        dischargeSummary: dischargeSummary || 'Patient vitals stable. Discharged following scheduled daycare transfusion.'
      },
      include: {
        patient: true
      }
    });

    // Check if patient has any other active admission; if not, set status to discharged
    const activeOthers = await prisma.admission.count({
      where: { patientId: admission.patientId, status: 'admitted' }
    });

    if (activeOthers === 0) {
      await prisma.patient.update({
        where: { id: admission.patientId },
        data: { status: 'discharged' }
      });
    }

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'DISCHARGE_PATIENT',
      module: 'ADMISSIONS',
      recordId: admission.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { admissionCode: admission.admissionCode, patient: admission.patient.name }
    });

    return res.json({ success: true, data: admission });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAdmissions,
  createAdmission,
  dischargeAdmission
};
