const prisma = require('../config/db');
const { checkDatabaseIntegrity } = require('../config/dbMigrator');

async function getHealth(req, res) {
  try {
    const integrity = await checkDatabaseIntegrity();
    const isHealthy = integrity.connected && integrity.missingTables.length === 0;

    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'Rithanya Hospital API',
      version: '1.0.0',
      database: integrity.connected ? 'connected' : 'disconnected',
      dbIntegrity: integrity,
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
