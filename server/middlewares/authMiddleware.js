const { verifyToken } = require('../utils/jwtHelper');
const prisma = require('../config/db');

async function authenticate(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        allowedModules: true,
        enabled: true,
        staffProfile: {
          select: { id: true }
        }
      }
    });

    if (!user || !user.enabled) {
      return res.status(403).json({ success: false, message: 'User account not found or disabled.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions || {},
      allowedModules: user.allowedModules || [],
      staffId: user.staffProfile ? user.staffProfile.id : null
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ success: false, message: 'Internal authentication error.' });
  }
}

module.exports = {
  authenticate,
  verifyToken: authenticate
};
