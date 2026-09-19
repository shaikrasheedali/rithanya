const prisma = require('../config/db');

async function getHealth(req, res) {
  try {
    // Quick DB ping
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      status: 'healthy',
      service: 'Rithanya Hospital API',
      version: '1.0.0',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(503).json({
      status: 'degraded',
      service: 'Rithanya Hospital API',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  getHealth
};
