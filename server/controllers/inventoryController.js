const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

async function getBloodInventory(req, res, next) {
  try {
    const bloodStocks = await prisma.bloodInventory.findMany({
      orderBy: { group: 'asc' }
    });

    const recentLogs = await prisma.inventoryLog.findMany({
      take: 20,
      orderBy: { date: 'desc' },
      include: {
        patient: { select: { patientCode: true, name: true } }
      }
    });

    const totals = bloodStocks.reduce(
      (acc, curr) => {
        acc.totalUnits += curr.units;
        acc.totalReserved += curr.reservedUnits;
        acc.availableUnits += curr.units - curr.reservedUnits;
        if (curr.units <= curr.threshold) acc.criticalAlerts += 1;
        return acc;
      },
      { totalUnits: 0, totalReserved: 0, availableUnits: 0, criticalAlerts: 0 }
    );

    return res.json({
      success: true,
      data: {
        stocks: bloodStocks,
        logs: recentLogs,
        totals
      }
    });
  } catch (err) {
    next(err);
  }
}

async function quickLoadStock(req, res, next) {
  try {
    const { group, units, source, expiryDate } = req.body;

    if (!group || !units || parseInt(units, 10) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid blood group and positive units required' });
    }

    const numUnits = parseInt(units, 10);
    const expiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 35 * 86400000);

    const { updatedStock, log } = await prisma.$transaction(async (tx) => {
      const count = await tx.inventoryLog.count();
      let logCode = `BLD-${100 + count + 1}`;
      const existingLog = await tx.inventoryLog.findUnique({ where: { logCode } });
      if (existingLog) {
        logCode = `BLD-${100 + count + 1}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      // Upsert blood inventory atomically
      const stock = await tx.bloodInventory.upsert({
        where: { group },
        update: {
          units: { increment: numUnits },
          expiryDate: expiry
        },
        create: {
          group,
          units: numUnits,
          reservedUnits: 0,
          threshold: 10,
          capacity: 35,
          expiryDate: expiry
        }
      });

      // Log the transaction atomically
      const newLog = await tx.inventoryLog.create({
        data: {
          logCode,
          bloodGroup: group,
          type: 'Stock Load',
          units: numUnits,
          date: new Date(),
          expiryDate: expiry,
          performedBy: req.user ? req.user.name : 'Chief Physician',
          notes: source || 'Received from blood bank reserve'
        }
      });

      return { updatedStock: stock, log: newLog };
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'LOAD_BLOOD_STOCK',
      module: 'INVENTORY',
      recordId: log.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { group, units: numUnits, source }
    });

    return res.json({ success: true, stock: updatedStock, log });
  } catch (err) {
    next(err);
  }
}

async function quickDispenseStock(req, res, next) {
  try {
    const { group, units, patientId, notes } = req.body;

    if (!group || !units || parseInt(units, 10) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid blood group and units required' });
    }

    const numUnits = parseInt(units, 10);

    const result = await prisma.$transaction(async (tx) => {
      const currentStock = await tx.bloodInventory.findUnique({ where: { group } });

      if (!currentStock || currentStock.units < numUnits) {
        const err = new Error(`Insufficient units for ${group}. Available: ${currentStock ? currentStock.units : 0}`);
        err.status = 400;
        throw err;
      }

      const count = await tx.inventoryLog.count();
      let logCode = `BLD-${100 + count + 1}`;
      const existingLog = await tx.inventoryLog.findUnique({ where: { logCode } });
      if (existingLog) {
        logCode = `BLD-${100 + count + 1}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const updatedStock = await tx.bloodInventory.update({
        where: { group },
        data: {
          units: { decrement: numUnits }
        }
      });

      let patientName = 'Daycare Transfusion';
      if (patientId) {
        const p = await tx.patient.findUnique({ where: { id: patientId } });
        if (p) patientName = p.name;
      }

      const log = await tx.inventoryLog.create({
        data: {
          logCode,
          bloodGroup: group,
          type: 'Issued',
          units: numUnits,
          date: new Date(),
          performedBy: req.user ? req.user.name : 'Transfusion Nurse',
          notes: notes ? `${notes} · Patient: ${patientName}` : `Transfusion Daycare · Patient: ${patientName}`,
          patientId: patientId || null
        }
      });

      return { updatedStock, log, patientName };
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'DISPENSE_BLOOD_STOCK',
      module: 'INVENTORY',
      recordId: result.log.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { group, units: numUnits, patientName: result.patientName }
    });

    return res.json({ success: true, stock: result.updatedStock, log: result.log });
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

async function getInventoryLogs(req, res, next) {
  try {
    const logs = await prisma.inventoryLog.findMany({
      orderBy: { date: 'desc' },
      include: {
        patient: { select: { patientCode: true, name: true } }
      }
    });
    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

async function getPublicBloodStock(req, res, next) {
  try {
    const bloodStocks = await prisma.bloodInventory.findMany({
      orderBy: { group: 'asc' }
    });

    const formattedStocks = bloodStocks.map((s) => {
      const reserved = s.reservedUnits || 0;
      const unreserved = Math.max(0, s.units - reserved);
      return {
        id: s.id,
        group: s.group,
        totalUnits: s.units,
        reservedUnits: reserved,
        unreservedUnits: unreserved,
        availableUnits: unreserved, // exact live unreserved count
        threshold: s.threshold,
        isLow: unreserved <= s.threshold,
        status: unreserved <= s.threshold ? 'Near Low' : 'Optimal',
        expiryDate: s.expiryDate
      };
    });

    const totals = formattedStocks.reduce(
      (acc, curr) => {
        acc.totalUnits += curr.totalUnits;
        acc.totalReserved += curr.reservedUnits;
        acc.availableUnits += curr.unreservedUnits;
        if (curr.isLow) acc.criticalAlerts += 1;
        return acc;
      },
      { totalUnits: 0, totalReserved: 0, availableUnits: 0, criticalAlerts: 0 }
    );

    return res.json({
      success: true,
      data: {
        stocks: formattedStocks,
        totals
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBloodInventory,
  quickLoadStock,
  quickDispenseStock,
  getInventoryLogs,
  getPublicBloodStock
};

