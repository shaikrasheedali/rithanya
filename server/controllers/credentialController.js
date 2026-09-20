const prisma = require('../config/db');
const { hashPassword } = require('../utils/argonHelper');
const { encrypt, decrypt } = require('../utils/encryption');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getCredentials(req, res, next) {
  try {
    const requesterRole = req.user ? req.user.role : 'SUPERADMIN';

    let filter = {};
    if (requesterRole === 'ADMIN') {
      // Admin can only view and manage STAFF accounts
      filter = { role: 'STAFF' };
    } else if (requesterRole === 'STAFF') {
      return res.status(403).json({ success: false, message: 'Access denied: Staff cannot view credentials' });
    }

    const users = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        enabled: true,
        permissions: true,
        allowedModules: true,
        plainPasswordEnc: true,
        creatorId: true,
        lastLogin: true,
        createdAt: true,
        staffProfile: {
          select: { id: true, staffCode: true, designation: true, department: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Decrypt passwords for authorized viewing by Superadmin and Admin
    const mapped = users.map((u) => {
      let visiblePassword = null;
      if (u.plainPasswordEnc) {
        try {
          visiblePassword = decrypt(u.plainPasswordEnc);
        } catch (e) {
          visiblePassword = null;
        }
      }

      const { plainPasswordEnc, ...safeUser } = u;
      return {
        ...safeUser,
        visiblePassword
      };
    });

    return res.json({ success: true, data: mapped });
  } catch (err) {
    next(err);
  }
}

async function createCredential(req, res, next) {
  try {
    const requesterRole = req.user ? req.user.role : 'SUPERADMIN';
    const { email, password, name, role, permissions, allowedModules, staffId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required' });
    }

    const targetRole = role ? role.toUpperCase() : 'STAFF';

    // Role enforcement: Admin can only create Staff
    if (requesterRole === 'ADMIN' && targetRole !== 'STAFF') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Superadmin can create Admin accounts'
      });
    }

    // Only one Superadmin allowed
    if (targetRole === 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Cannot create additional Superadmin accounts'
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    const passwordHash = await hashPassword(password);
    const plainPasswordEnc = encrypt(password);

    const defaultModules = [
      'dashboard', 'patients', 'clinical', 'admissions', 'inventory', 'appointments'
    ];

    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: targetRole,
        passwordHash,
        plainPasswordEnc,
        creatorId: req.user ? req.user.id : null,
        allowedModules: allowedModules || (targetRole === 'ADMIN' ? [
          'dashboard', 'patients', 'clinical', 'admissions', 'inventory',
          'appointments', 'treatments', 'services', 'blogs', 'specialists',
          'products', 'orders', 'gallery', 'media', 'credentials', 'staff',
          'finance', 'erasure', 'settings'
        ] : defaultModules),
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
        visiblePassword: password,
        allowedModules: newUser.allowedModules,
        permissions: newUser.permissions
      }
    });
  } catch (err) {
    next(err);
  }
}

async function updatePermissions(req, res, next) {
  try {
    const requesterRole = req.user ? req.user.role : 'SUPERADMIN';
    const { id } = req.params;
    const { permissions, allowedModules, enabled, role } = req.body;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User credential not found' });
    }

    // Role enforcement: Admin can only modify Staff
    if (requesterRole === 'ADMIN' && targetUser.role !== 'STAFF') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admins can only configure Staff module permissions'
      });
    }

    // Protect Superadmin role from alteration
    if (targetUser.role === 'SUPERADMIN' && role && role !== 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot demote primary Superadmin' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(permissions !== undefined && { permissions }),
        ...(allowedModules !== undefined && { allowedModules }),
        ...(enabled !== undefined && { enabled }),
        ...(role && requesterRole === 'SUPERADMIN' && { role })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        enabled: true,
        permissions: true,
        allowedModules: true
      }
    });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Superadmin',
      actorRole: req.user ? req.user.role : 'SUPERADMIN',
      action: 'UPDATE_PERMISSIONS',
      module: 'AUTH',
      recordId: updatedUser.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { email: updatedUser.email, allowedModules: updatedUser.allowedModules }
    });

    return res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const requesterRole = req.user ? req.user.role : 'SUPERADMIN';
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User credential not found' });
    }

    // Role enforcement: Admin can only reset password for Staff
    if (requesterRole === 'ADMIN' && targetUser.role !== 'STAFF') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admins can only manage Staff passwords'
      });
    }

    const passwordHash = await hashPassword(newPassword);
    const plainPasswordEnc = encrypt(newPassword);

    await prisma.user.update({
      where: { id },
      data: { passwordHash, plainPasswordEnc }
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

    return res.json({
      success: true,
      message: 'Password updated successfully with Argon2 hash and encrypted backup',
      visiblePassword: newPassword
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCredential(req, res, next) {
  try {
    const requesterRole = req.user ? req.user.role : 'SUPERADMIN';
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User credential not found' });
    }

    if (targetUser.role === 'SUPERADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot delete primary superadmin account' });
    }

    // Role enforcement: Admin can only delete Staff
    if (requesterRole === 'ADMIN' && targetUser.role !== 'STAFF') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only Superadmin can remove Admin accounts'
      });
    }

    await prisma.user.delete({ where: { id } });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Superadmin',
      actorRole: req.user ? req.user.role : 'SUPERADMIN',
      action: 'DELETE_CREDENTIAL',
      module: 'AUTH',
      recordId: id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { deletedEmail: targetUser.email, role: targetUser.role }
    });

    return res.json({ success: true, message: 'Credential deleted successfully' });
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
