const prisma = require('../config/db');

async function getAuditLogs(req, res, next) {
  try {
    const { module, action, limit } = req.query;

    const logs = await prisma.auditLog.findMany({
      where: {
        ...(module && { module }),
        ...(action && { action })
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit, 10) : 100
    });

    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAuditLogs
};
