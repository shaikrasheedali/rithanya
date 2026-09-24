const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

/**
 * Public endpoint: Submit a Data Erasure Request under DPDP Act 2023
 */
async function submitErasureRequest(req, res, next) {
  try {
    const { patientName, phone, identifierLast4, patientCode, reason } = req.body;

    if (!patientName || !phone || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Patient name, phone number, and reason for erasure are required under DPDP Act.'
      });
    }

    const erasureReq = await prisma.erasureRequest.create({
      data: {
        patientName: patientName.trim(),
        phone: phone.trim(),
        identifierLast4: identifierLast4 ? identifierLast4.trim() : null,
        patientCode: patientCode ? patientCode.trim().toUpperCase() : null,
        reason: reason.trim(),
        status: 'pending'
      }
    });

    recordAuditLog({
      actorName: patientName,
      actorRole: 'PUBLIC',
      action: 'DPDP_ERASURE_REQUESTED',
      module: 'DPDP',
      recordId: erasureReq.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { patientName, phone, patientCode }
    });

    return res.status(201).json({
      success: true,
      data: erasureReq,
      message: 'Your Right to Erasure request has been securely lodged. Our Data Protection Officer (DPO) and clinical administration will review and process your request within 72 hours in compliance with the DPDP Act 2023.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin endpoint: List all DPDP erasure requests
 */
async function getErasureRequests(req, res, next) {
  try {
    const { status } = req.query;
    const requests = await prisma.erasureRequest.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { requestedAt: 'desc' }
    });

    return res.json({ success: true, data: requests });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin endpoint: Approve and execute full cascading erasure of patient
 */
async function approveAndPurge(req, res, next) {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const reqRecord = await prisma.erasureRequest.findUnique({ where: { id } });
    if (!reqRecord) {
      return res.status(404).json({ success: false, message: 'Erasure request not found' });
    }

    // Find matching patient by patientCode or phone
    const patientWhere = [];
    if (reqRecord.patientCode) patientWhere.push({ patientCode: reqRecord.patientCode });
    if (reqRecord.phone) patientWhere.push({ phone: reqRecord.phone });

    // Atomic cascading erasure under DPDP Act
    const { purgedCount, updated } = await prisma.$transaction(async (tx) => {
      let count = 0;
      if (patientWhere.length > 0) {
        const matchingPatients = await tx.patient.findMany({
          where: { OR: patientWhere }
        });

        for (const p of matchingPatients) {
          // Cascade delete readings
          await tx.clinicalReading.deleteMany({ where: { patientId: p.id } });
          // Cascade delete admissions
          await tx.admission.deleteMany({ where: { patientId: p.id } });
          // Detach or delete inventory logs referencing patient
          await tx.inventoryLog.updateMany({
            where: { patientId: p.id },
            data: { patientId: null, notes: 'Patient unlinked per DPDP Erasure' }
          });
          // Finally delete patient record
          await tx.patient.delete({ where: { id: p.id } });
          count += 1;
        }
      }

      // Update request record atomically
      const updatedReq = await tx.erasureRequest.update({
        where: { id },
        data: {
          status: 'completed',
          processedAt: new Date(),
          processedBy: req.user ? req.user.name : 'DPO / Admin',
          notes: notes ? `${notes} (Purged ${count} patient record(s))` : `Approved and purged ${count} record(s)`
        }
      });

      return { purgedCount: count, updated: updatedReq };
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'DPDP_ERASURE_APPROVED_PURGED',
      module: 'DPDP',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { requestId: id, purgedCount, processedBy: updated.processedBy }
    });

    return res.json({
      success: true,
      data: updated,
      message: `Erasure completed. ${purgedCount} patient record(s) and all linked vitals, admissions, and digital consent signatures were purged permanently.`
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin endpoint: Reject erasure request with formal justification
 */
async function rejectErasureRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updated = await prisma.erasureRequest.update({
      where: { id },
      data: {
        status: 'rejected',
        processedAt: new Date(),
        processedBy: req.user ? req.user.name : 'DPO / Admin',
        notes: notes || 'Rejected due to mandatory statutory clinical retention requirements.'
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'DPDP_ERASURE_REJECTED',
      module: 'DPDP',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { reason: updated.notes }
    });

    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitErasureRequest,
  getErasureRequests,
  approveAndPurge,
  rejectErasureRequest
};
