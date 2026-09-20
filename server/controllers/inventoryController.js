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

    const count = await prisma.inventoryLog.count();
    const logCode = `BLD-${100 + count + 1}`;

    const numUnits = parseInt(units, 10);
    const expiry = expiryDate ? new Date(expiryDate) : new Date(Date.now() + 35 * 86400000);

    // Upsert blood inventory
    const updatedStock = await prisma.bloodInventory.upsert({
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

    // Log the transaction
    const log = await prisma.inventoryLog.create({
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
    const currentStock = await prisma.bloodInventory.findUnique({ where: { group } });

    if (!currentStock || currentStock.units < numUnits) {
      return res.status(400).json({
        success: false,
        message: `Insufficient units for ${group}. Available: ${currentStock ? currentStock.units : 0}`
      });
    }

    const count = await prisma.inventoryLog.count();
    const logCode = `BLD-${100 + count + 1}`;

    const updatedStock = await prisma.bloodInventory.update({
      where: { group },
      data: {
        units: { decrement: numUnits }
      }
    });

    let patientName = 'Daycare Transfusion';
    if (patientId) {
      const p = await prisma.patient.findUnique({ where: { id: patientId } });
      if (p) patientName = p.name;
    }

    const log = await prisma.inventoryLog.create({
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

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'DISPENSE_BLOOD_STOCK',
      module: 'INVENTORY',
      recordId: log.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { group, units: numUnits, patientName }
    });

    return res.json({ success: true, stock: updatedStock, log });
  } catch (err) {
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

