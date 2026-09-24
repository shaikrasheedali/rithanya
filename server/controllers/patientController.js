const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getPatients(req, res, next) {
  try {
    const { search, bloodGroup, status } = req.query;

    const where = {
      isErased: false,
      ...(bloodGroup && { bloodGroup }),
      ...(status && { status })
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { patientCode: { contains: search } },
        { phone: { contains: search } },
        { condition: { contains: search } }
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        admissions: {
          orderBy: { admittedOn: 'desc' },
          take: 1
        },
        _count: {
          select: {
            clinicalReadings: true,
            admissions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, data: patients });
  } catch (err) {
    next(err);
  }
}

async function getPatientById(req, res, next) {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findFirst({
      where: {
        OR: [{ id }, { patientCode: id }],
        isErased: false
      },
      include: {
        admissions: {
          orderBy: { admittedOn: 'desc' }
        },
        clinicalReadings: {
          orderBy: { date: 'asc' }
        },
        inventoryLogs: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found or erased under DPDP' });
    }

    return res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
}

async function createPatient(req, res, next) {
  try {
    const { name, age, gender, bloodGroup, phone, condition, allergies, status, consentPhotoBlob } = req.body;

    if (!name || !age || !gender || !bloodGroup || !phone) {
      return res.status(400).json({ success: false, message: 'Name, age, gender, blood group, and phone are required' });
    }

    // Generate unique Patient Code (RH-P...)
    let nextNum = 24001;
    const existingPatients = await prisma.patient.findMany({ select: { patientCode: true } });
    const pNums = existingPatients
      .map(p => {
        const match = p.patientCode && p.patientCode.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => !isNaN(n) && n >= 24000);
    if (pNums.length > 0) {
      nextNum = Math.max(...pNums) + 1;
    }
    const patientCode = `RH-P${nextNum}`;

    const patient = await prisma.patient.create({
      data: {
        patientCode,
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        bloodGroup,
        phone: phone.trim(),
        condition: condition ? condition.trim() : 'General Outpatient',
        allergies: allergies || 'None reported',
        status: status || 'outpatient',
        consentPhotoBlob: consentPhotoBlob || null,
        consentCapturedAt: consentPhotoBlob ? new Date() : null,
        consentStaffId: req.user ? req.user.id : null
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'CREATE_PATIENT',
      module: 'PATIENTS',
      recordId: patient.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { patientCode: patient.patientCode, name: patient.name }
    });

    return res.status(201).json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
}

async function updatePatient(req, res, next) {
  try {
    const { id } = req.params;
    const { name, age, gender, bloodGroup, phone, condition, allergies, status } = req.body;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(age && { age: parseInt(age, 10) }),
        ...(gender && { gender }),
        ...(bloodGroup && { bloodGroup }),
        ...(phone && { phone: phone.trim() }),
        ...(condition && { condition: condition.trim() }),
        ...(allergies && { allergies }),
        ...(status && { status })
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'UPDATE_PATIENT',
      module: 'PATIENTS',
      recordId: patient.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { patientCode: patient.patientCode }
    });

    return res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
}

/**
 * DPDP Act: Capture digital photo consent signature via device camera
 */
async function captureConsentPhoto(req, res, next) {
  try {
    const { id } = req.params;
    const { photoDataUrl } = req.body;

    if (!photoDataUrl) {
      return res.status(400).json({ success: false, message: 'Photo consent dataURL is required' });
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        consentPhotoBlob: photoDataUrl,
        consentCapturedAt: new Date(),
        consentStaffId: req.user ? req.user.id : 'Staff'
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'CONSENT_CAPTURED',
      module: 'DPDP',
      recordId: patient.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { patientCode: patient.patientCode, staff: req.user ? req.user.name : 'Staff' }
    });

    return res.json({
      success: true,
      message: 'Digital photo consent signature recorded successfully under DPDP Act.',
      capturedAt: patient.consentCapturedAt
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DPDP Act: Right to Erasure ("Right to be Forgotten")
 * Completely and irreversibly purges all data related to a patient from the database.
 */
async function purgePatientData(req, res, next) {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id }
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient record not found' });
    }

    // Atomic cascading purge under DPDP Act
    await prisma.$transaction(async (tx) => {
      // Cascade delete clinical readings
      await tx.clinicalReading.deleteMany({ where: { patientId: id } });
      // Cascade delete admissions
      await tx.admission.deleteMany({ where: { patientId: id } });
      // Detach or delete inventory logs referencing patient
      await tx.inventoryLog.updateMany({
        where: { patientId: id },
        data: { patientId: null, notes: 'Patient unlinked per DPDP Erasure' }
      });
      // Finally delete patient record and consent signature blob
      await tx.patient.delete({ where: { id } });
    }, { maxWait: 10000, timeout: 30000 });

    // Record compliance audit trail (anonymized patient code only)
    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'RIGHT_TO_ERASURE_PURGE',
      module: 'DPDP',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: {
        anonymizedPatientCode: patient.patientCode,
        erasureReason: req.body.reason || 'User requested erasure under DPDP Act 2023',
        purgedAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: `Patient ${patient.patientCode} and all associated records have been permanently erased as per DPDP Act.`
    });
  } catch (err) {
    next(err);
  }
}

async function convertToInpatient(req, res, next) {
  try {
    const { id } = req.params;
    const { ward, bed, attendingDoctor, diagnosis } = req.body;

    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const { admission, updatedPatient } = await prisma.$transaction(async (tx) => {
      const count = await tx.admission.count();
      let admissionCode = `ADM-${900 + count + 1}`;
      const existingAdm = await tx.admission.findUnique({ where: { admissionCode } });
      if (existingAdm) {
        admissionCode = `ADM-${900 + count + 1}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const createdAdmission = await tx.admission.create({
        data: {
          admissionCode,
          patientId: id,
          ward: ward || 'Daycare Transfusion Ward',
          bed: bed || 'Bed-01',
          attendingDoctor: attendingDoctor || 'Dr. Narayana Murthy, MD',
          diagnosis: diagnosis || patient.condition || 'Admitted for Observation & Treatment',
          status: 'admitted',
          admittedOn: new Date()
        }
      });

      const updated = await tx.patient.update({
        where: { id },
        data: { status: 'admitted' }
      });

      return { admission: createdAdmission, updatedPatient: updated };
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'CONVERT_TO_INPATIENT',
      module: 'PATIENTS',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { patientCode: patient.patientCode, admissionCode: admission.admissionCode, ward: admission.ward, bed: admission.bed }
    });

    return res.status(201).json({
      success: true,
      message: `Patient ${patient.name} (${patient.patientCode}) successfully converted to In-Patient.`,
      data: {
        patient: updatedPatient,
        admission
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  captureConsentPhoto,
  purgePatientData,
  convertToInpatient
};
