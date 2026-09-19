const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getStaff(req, res, next) {
  try {
    const { department, status } = req.query;

    const staff = await prisma.staff.findMany({
      where: {
        ...(department && { department }),
        ...(status && { status })
      },
      include: {
        user: {
          select: { id: true, email: true, role: true, enabled: true, permissions: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}

async function createStaff(req, res, next) {
  try {
    const { name, designation, department, salary, shift, phone, email, status } = req.body;

    if (!name || !designation || !department || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Name, designation, department, phone, and email are required' });
    }

    let nextNum = 100;
    const existingCodes = await prisma.staff.findMany({ select: { staffCode: true } });
    const nums = existingCodes
      .map(s => {
        const match = s.staffCode && s.staffCode.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => !isNaN(n) && n >= 100);
    if (nums.length > 0) {
      nextNum = Math.max(...nums) + 1;
    } else {
      nextNum = 101;
    }
    const staffCode = `RH-${nextNum}`;

    const member = await prisma.staff.create({
      data: {
        staffCode,
        name: name.trim(),
        designation: designation.trim(),
        department: department.trim(),
        salary: salary ? parseFloat(salary) : 0,
        shift: shift || 'Day',
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        status: status || 'active'
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Admin',
      actorRole: req.user ? req.user.role : 'ADMIN',
      action: 'CREATE_STAFF',
      module: 'STAFF',
      recordId: member.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { staffCode: member.staffCode, name: member.name }
    });

    return res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function updateStaff(req, res, next) {
  try {
    const { id } = req.params;
    const { name, designation, department, salary, shift, phone, email, status } = req.body;

    const member = await prisma.staff.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(designation && { designation: designation.trim() }),
        ...(department && { department: department.trim() }),
        ...(salary !== undefined && { salary: parseFloat(salary) }),
        ...(shift && { shift }),
        ...(phone && { phone: phone.trim() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(status && { status })
      }
    });

    return res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    return res.json({ success: true, message: 'Staff profile removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff
};
