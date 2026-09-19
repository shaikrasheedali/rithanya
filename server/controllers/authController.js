const prisma = require('../config/db');
const { verifyPassword } = require('../utils/argonHelper');
const { signToken } = require('../utils/jwtHelper');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { staffProfile: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.enabled) {
      return res.status(403).json({ success: false, message: 'Account is disabled. Contact superadmin.' });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Record login audit log
    recordAuditLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'LOGIN',
      module: 'AUTH',
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { email: user.email }
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || {},
        staffProfile: user.staffProfile
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { staffProfile: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: user.permissions || {},
        staffProfile: user.staffProfile
      }
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    if (req.user) {
      recordAuditLog({
        actorId: req.user.id,
        actorName: req.user.name,
        actorRole: req.user.role,
        action: 'LOGOUT',
        module: 'AUTH',
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getMe,
  logout
};
