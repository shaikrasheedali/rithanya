/**
 * RBAC Middleware for Role & Module Authorization
 */
function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`
    });
  };
}

/**
 * Checks module-level permission for STAFF/ADMIN
 * Superadmin always has full bypass access.
 */
function requirePermission(moduleKey) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role === 'SUPERADMIN' || req.user.role === 'ADMIN') {
      return next();
    }

    if (Array.isArray(req.user.allowedModules) && (req.user.allowedModules.includes(moduleKey) || req.user.allowedModules.includes('all'))) {
      return next();
    }

    const perms = req.user.permissions || {};
    if (perms[moduleKey] === true || perms.all === true) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Insufficient permissions for module: ${moduleKey}`
    });
  };
}

module.exports = {
  requireRoles,
  requirePermission
};
