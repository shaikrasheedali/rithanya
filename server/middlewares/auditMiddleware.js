const prisma = require('../config/db');

/**
 * Audit log recorder helper function
 */
async function recordAuditLog({ actorId, actorName, actorRole, action, module, recordId, ipAddress, details }) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        actorName: actorName || 'System',
        actorRole: actorRole || 'SYSTEM',
        action,
        module,
        recordId: recordId ? String(recordId) : null,
        ipAddress: ipAddress || '127.0.0.1',
        details: details || {}
      }
    });
  } catch (err) {
    console.error('AuditLog record error:', err.message);
  }
}

/**
 * Express middleware to automatically log mutating operations
 */
function auditLogger(moduleName, actionName) {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      res.send = originalSend;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const actorId = req.user ? req.user.id : null;
        const actorName = req.user ? req.user.name : (req.body.name || 'Anonymous');
        const actorRole = req.user ? req.user.role : 'PUBLIC';
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        recordAuditLog({
          actorId,
          actorName,
          actorRole,
          action: actionName || `${req.method}_${moduleName}`,
          module: moduleName,
          recordId: req.params.id || null,
          ipAddress: String(ipAddress).split(',')[0].trim(),
          details: {
            path: req.originalUrl,
            method: req.method,
            query: req.query,
            bodySummary: req.body ? Object.keys(req.body) : []
          }
        });
      }
      return res.send(data);
    };
    next();
  };
}

module.exports = {
  auditLogger,
  recordAuditLog
};
