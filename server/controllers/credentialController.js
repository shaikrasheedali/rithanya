const prisma = require('../config/db');
const { hashPassword } = require('../utils/argonHelper');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getCredentials(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        enabled: true,
        permissions: true,
        lastLogin: true,
        createdAt: true,
        staffProfile: {
          select: { id: true, staffCode: true, designation: true, department: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

async function createCredential(req, res, next) {
  try {
    const { email, password, name, role, permissions, staffId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: role || 'STAFF',
        passwordHash,
        permissions: permissions || {
          dashboard: true,
          patients: true,
          clinical: true,
          inventory: true,
          appointments: true
        }
      }
    });

    if (staffId) {
      await prisma.staff.update({
        where: { id: staffId },
        data: { userId: newUser.id }
      });
    }

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Superadmin',
      actorRole: req.user ? req.user.role : 'SUPERADMIN',
      action: 'CREATE_CREDENTIAL',
      module: 'AUTH',
      recordId: newUser.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { email: newUser.email, role: newUser.role }
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        permissions: newUser.permissions
      }
    });
  } catch (err) {
    next(err);
  }
}

async function updatePermissions(req, res, next) {
  try {
    const { id } = req.params;
    const { permissions, enabled, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(permissions !== undefined && { permissions }),
        ...(enabled !== undefined && { enabled }),
        ...(role && { role })
      },
      select: { id: true, email: true, name: true, role: true, enabled: true, permissions: true }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Superadmin',
      actorRole: req.user ? req.user.role : 'SUPERADMIN',
      action: 'UPDATE_PERMISSIONS',
      module: 'AUTH',
      recordId: user.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { email: user.email, permissions }
    });

    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { passwordHash }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Superadmin',
      actorRole: req.user ? req.user.role : 'SUPERADMIN',
      action: 'RESET_PASSWORD',
      module: 'AUTH',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });

    return res.json({ success: true, message: 'Password updated successfully with Argon2 hashing' });
  } catch (err) {
    next(err);
  }
}

async function deleteCredential(req, res, next) {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (targetUser && targetUser.role === 'SUPERADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot delete primary superadmin account' });
    }

    await prisma.user.delete({ where: { id } });
    return res.json({ success: true, message: 'Credential deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCredentials,
  createCredential,
  updatePermissions,
  resetPassword,
  deleteCredential
};
