const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getInquiries(req, res, next) {
  try {
    const { status } = req.query;
    const inquiries = await prisma.productInquiry.findMany({
      where: {
        ...(status && { status })
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, data: inquiries });
  } catch (err) {
    next(err);
  }
}

async function createInquiry(req, res, next) {
  try {
    const { packageId, packageName, name, phone, email, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const inquiry = await prisma.productInquiry.create({
      data: {
        packageId: packageId || null,
        packageName: packageName || 'Health Check Inquiry',
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        message: message ? message.trim() : null,
        status: 'new'
      }
    });

    recordAuditLog({
      actorName: name,
      actorRole: 'PUBLIC',
      action: 'SUBMIT_INQUIRY',
      module: 'PRODUCTS',
      recordId: inquiry.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { packageName, phone }
    });

    return res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Inquiry received. Our clinical coordinator will reach out to you promptly.'
    });
  } catch (err) {
    next(err);
  }
}

async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, followUpNotes } = req.body;

    const inquiry = await prisma.productInquiry.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(followUpNotes !== undefined && { followUpNotes })
      }
    });

    return res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
}

async function deleteInquiry(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.productInquiry.delete({ where: { id } });
    return res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry
};
