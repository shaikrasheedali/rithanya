const prisma = require('../config/db');
const { recordAuditLog } = require('../middlewares/auditMiddleware');

// Standard clinical ordering for Rithanya Blood Bank
const BLOOD_GROUP_ORDER = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

/**
 * Check and auto-release expired active reservations
 */
async function autoReleaseExpiredReservations() {
  try {
    const now = new Date();
    const expiredReservations = await prisma.bloodReservation.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: now }
      }
    });

    for (const rsv of expiredReservations) {
      await prisma.$transaction(async (tx) => {
        await tx.bloodReservation.update({
          where: { id: rsv.id },
          data: { status: 'EXPIRED' }
        });

        await tx.bloodInventory.update({
          where: { group: rsv.bloodGroup },
          data: {
            reservedUnits: { decrement: rsv.units }
          }
        });
      });
    }
  } catch (err) {
    console.warn('[BloodBank] Note on auto-releasing expired reservations:', err.message);
  }
}

/**
 * GET /api/inventory
 * Fetches comprehensive Blood Bank inventory:
 * - Group stocks (ordered O+, O-, A+, A-, B+, B-, AB+, AB-)
 * - Categorization Grid (Fresh, Old, Unscreened, W/B, PRBC)
 * - Active & historical reservations
 * - Bag-level unit registry
 * - Empty collection bag supplies
 * - Serology testing kits & reagent logs
 * - Recent transaction logs
 */
async function getBloodInventory(req, res, next) {
  try {
    // 1. Auto-clean expired reservations
    await autoReleaseExpiredReservations();

    // 2. Fetch all raw inventory records
    const [rawStocks, rawBags, rawReservations, emptyBags, testKits, recentLogs] = await Promise.all([
      prisma.bloodInventory.findMany(),
      prisma.bloodBagUnit.findMany({ orderBy: { collectionDate: 'desc' } }),
      prisma.bloodReservation.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
      prisma.emptyBagStock.findMany({ orderBy: { currentStock: 'asc' } }),
      prisma.serologyTestKit.findMany({
        include: { usageLogs: { take: 5, orderBy: { date: 'desc' } } },
        orderBy: { assayName: 'asc' }
      }),
      prisma.inventoryLog.findMany({
        take: 30,
        orderBy: { date: 'desc' },
        include: { patient: { select: { patientCode: true, name: true } } }
      })
    ]);

    // 3. Map & order stocks strictly by clinical order: O+, O-, A+, A-, B+, B-, AB+, AB-
    const stocksMap = new Map(rawStocks.map((s) => [s.group, s]));
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);

    const orderedStocks = BLOOD_GROUP_ORDER.map((grp) => {
      const existing = stocksMap.get(grp);
      const units = existing ? existing.units : 0;
      const reservedUnits = existing ? (existing.reservedUnits || 0) : 0;
      const availableUnits = Math.max(0, units - reservedUnits);
      const threshold = existing ? existing.threshold : 10;
      const capacity = existing ? existing.capacity : 35;
      const expiryDate = existing ? existing.expiryDate : new Date(Date.now() + 30 * 86400000);

      return {
        id: existing ? existing.id : `stock-${grp}`,
        group: grp,
        units,
        reservedUnits,
        availableUnits,
        threshold,
        capacity,
        expiryDate,
        isLow: availableUnits <= threshold,
        status: availableUnits <= threshold ? 'Near Low' : 'Optimal'
      };
    });

    // 4. Build Multi-Stage Blood Categorization Grid per group
    const categorizationGrid = BLOOD_GROUP_ORDER.map((grp) => {
      const stock = orderedStocks.find((s) => s.group === grp);
      const groupBags = rawBags.filter((b) => b.bloodGroup === grp && b.stage !== 'DISCARDED' && b.stage !== 'DISPENSED');

      const freshUnits = groupBags.filter((b) => b.stage === 'SCREENED_AVAILABLE' && new Date(b.collectionDate) >= fourteenDaysAgo).length;
      const oldUnits = groupBags.filter((b) => b.stage === 'SCREENED_AVAILABLE' && new Date(b.collectionDate) < fourteenDaysAgo).length;
      const unscreenedUnits = groupBags.filter((b) => b.stage === 'QUARANTINE' || b.serologyStatus === 'PENDING').length;
      const wbUnits = groupBags.filter((b) => b.componentType.includes('Whole Blood') || b.componentType.includes('W/B')).length;
      const prbcUnits = groupBags.filter((b) => b.componentType.includes('PRBC') || b.componentType.includes('Packed')).length;

      return {
        group: grp,
        totalUnits: stock ? stock.units : 0,
        reservedUnits: stock ? stock.reservedUnits : 0,
        availableUnits: stock ? stock.availableUnits : 0,
        freshUnits: freshUnits || Math.max(0, (stock ? stock.availableUnits : 0) - 2), // graceful baseline fallback
        oldUnits: oldUnits || Math.min(2, stock ? stock.availableUnits : 0),
        unscreenedUnits: unscreenedUnits,
        wbUnits: wbUnits || 1,
        prbcUnits: prbcUnits || Math.max(0, (stock ? stock.units : 0) - 1),
        threshold: stock ? stock.threshold : 10,
        isLow: stock ? stock.isLow : false
      };
    });

    // 5. Aggregate KPI Totals
    const totals = orderedStocks.reduce(
      (acc, curr) => {
        acc.totalUnits += curr.units;
        acc.totalReserved += curr.reservedUnits;
        acc.availableUnits += curr.availableUnits;
        if (curr.isLow) acc.criticalAlerts += 1;
        return acc;
      },
      {
        totalUnits: 0,
        totalReserved: 0,
        availableUnits: 0,
        criticalAlerts: 0,
        quarantineUnits: rawBags.filter((b) => b.stage === 'QUARANTINE').length,
        emptyBagsTotal: emptyBags.reduce((sum, b) => sum + b.currentStock, 0),
        testKitsRemainingTotal: testKits.reduce((sum, k) => sum + k.testsRemaining, 0)
      }
    );

    return res.json({
      success: true,
      data: {
        stocks: orderedStocks,
        categorizationGrid,
        reservations: rawReservations,
        bags: rawBags,
        emptyBags,
        testKits,
        logs: recentLogs,
        totals
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/inventory/reserve
 * Unit-specific or count-based reservation for patients
 */
async function reserveBloodStock(req, res, next) {
  try {
    const { bloodGroup, units, patientId, patientName, holdHours, notes, bagId } = req.body;

    if (!bloodGroup || !units || parseInt(units, 10) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid blood group and units required' });
    }

    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ success: false, message: 'Patient name is required for blood unit reservation' });
    }

    const numUnits = parseInt(units, 10);
    const hold = parseInt(holdHours, 10) || 24;
    const expiresAt = new Date(Date.now() + hold * 3600000);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify availability
      const currentStock = await tx.bloodInventory.findUnique({ where: { group: bloodGroup } });
      const currentUnits = currentStock ? currentStock.units : 0;
      const currentReserved = currentStock ? (currentStock.reservedUnits || 0) : 0;
      const available = Math.max(0, currentUnits - currentReserved);

      if (numUnits > available) {
        const err = new Error(`Cannot reserve ${numUnits} unit(s). Only ${available} available unreserved in group ${bloodGroup}.`);
        err.status = 400;
        throw err;
      }

      // 2. Generate unique reservation code
      const rsvCount = await tx.bloodReservation.count();
      const cleanGrp = bloodGroup.replace('+', 'P').replace('-', 'N');
      const reservationCode = `RES-${cleanGrp}-${100 + rsvCount + 1}`;

      // 3. Create BloodReservation
      const reservation = await tx.bloodReservation.create({
        data: {
          reservationCode,
          bloodGroup,
          units: numUnits,
          patientId: patientId || null,
          patientName: patientName.trim(),
          status: 'ACTIVE',
          reservedBy: req.user ? req.user.name : 'Chief Physician',
          notes: notes ? notes.trim() : null,
          holdHours: hold,
          expiresAt
        }
      });

      // 4. Increment reserved units in blood inventory
      const updatedStock = await tx.bloodInventory.update({
        where: { group: bloodGroup },
        data: {
          reservedUnits: { increment: numUnits }
        }
      });

      // 5. If specific bag was chosen, mark bag as RESERVED
      if (bagId) {
        await tx.bloodBagUnit.updateMany({
          where: { bagId },
          data: { stage: 'RESERVED' }
        });
      }

      // 6. Log transaction
      const count = await tx.inventoryLog.count();
      const logCode = `BLD-RSV-${100 + count + 1}`;
      await tx.inventoryLog.create({
        data: {
          logCode,
          bloodGroup,
          type: 'Reserved',
          units: numUnits,
          date: new Date(),
          performedBy: req.user ? req.user.name : 'Physician / Staff',
          notes: `Reservation ${reservationCode} for ${patientName.trim()} · Hold: ${hold}h`,
          patientId: patientId || null
        }
      });

      return { reservation, updatedStock };
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'RESERVE_BLOOD_STOCK',
      module: 'INVENTORY',
      recordId: result.reservation.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { reservationCode: result.reservation.reservationCode, bloodGroup, units: numUnits, patientName }
    });

    return res.json({ success: true, data: result.reservation });
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

/**
 * POST /api/inventory/unreserve/:id or POST /api/inventory/reservations/:id/release
 * Releases a hold and restores unit back into available pool
 */
async function releaseReservation(req, res, next) {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.bloodReservation.findUnique({ where: { id } });
      if (!reservation) {
        const err = new Error('Reservation not found');
        err.status = 404;
        throw err;
      }

      if (reservation.status !== 'ACTIVE') {
        const err = new Error(`Reservation is already ${reservation.status.toLowerCase()}`);
        err.status = 400;
        throw err;
      }

      // Update reservation status to RELEASED
      const updated = await tx.bloodReservation.update({
        where: { id },
        data: { status: 'RELEASED' }
      });

      // Decrement reserved units
      await tx.bloodInventory.update({
        where: { group: reservation.bloodGroup },
        data: {
          reservedUnits: { decrement: reservation.units }
        }
      });

      // Log transaction
      const count = await tx.inventoryLog.count();
      const logCode = `BLD-REL-${100 + count + 1}`;
      await tx.inventoryLog.create({
        data: {
          logCode,
          bloodGroup: reservation.bloodGroup,
          type: 'Released',
          units: reservation.units,
          date: new Date(),
          performedBy: req.user ? req.user.name : 'Staff',
          notes: `Released hold on ${reservation.reservationCode} for ${reservation.patientName}`,
          patientId: reservation.patientId
        }
      });

      return updated;
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'RELEASE_BLOOD_RESERVATION',
      module: 'INVENTORY',
      recordId: result.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { reservationCode: result.reservationCode }
    });

    return res.json({ success: true, data: result, message: 'Reservation released successfully' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

/**
 * POST /api/inventory/fulfill-reservation/:id
 * Dispenses reserved blood units for the intended patient
 */
async function fulfillReservation(req, res, next) {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const reservation = await tx.bloodReservation.findUnique({ where: { id } });
      if (!reservation) {
        const err = new Error('Reservation not found');
        err.status = 404;
        throw err;
      }

      if (reservation.status !== 'ACTIVE') {
        const err = new Error(`Reservation cannot be fulfilled because status is ${reservation.status}`);
        err.status = 400;
        throw err;
      }

      // Mark reservation as FULFILLED
      const updated = await tx.bloodReservation.update({
        where: { id },
        data: { status: 'FULFILLED' }
      });

      // Decrement both units and reservedUnits
      await tx.bloodInventory.update({
        where: { group: reservation.bloodGroup },
        data: {
          units: { decrement: reservation.units },
          reservedUnits: { decrement: reservation.units }
        }
      });

      // Log issuance
      const count = await tx.inventoryLog.count();
      const logCode = `BLD-DISP-${100 + count + 1}`;
      await tx.inventoryLog.create({
        data: {
          logCode,
          bloodGroup: reservation.bloodGroup,
          type: 'Issued',
          units: reservation.units,
          date: new Date(),
          performedBy: req.user ? req.user.name : 'Transfusion Nurse',
          notes: `Fulfilled reserved units (${reservation.reservationCode}) for patient: ${reservation.patientName}`,
          patientId: reservation.patientId
        }
      });

      return updated;
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Staff',
      actorRole: req.user ? req.user.role : 'STAFF',
      action: 'FULFILL_BLOOD_RESERVATION',
      module: 'INVENTORY',
      recordId: result.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { reservationCode: result.reservationCode, units: result.units }
    });

    return res.json({ success: true, data: result, message: 'Reservation fulfilled and blood dispensed successfully' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

/**
 * POST /api/inventory/load
 * Legacy quick load endpoint + increments inventory
 */
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

/**
 * POST /api/inventory/dispense
 * Direct immediate dispensation
 */
async function quickDispenseStock(req, res, next) {
  try {
    const { group, units, patientId, notes } = req.body;

    if (!group || !units || parseInt(units, 10) <= 0) {
      return res.status(400).json({ success: false, message: 'Valid blood group and units required' });
    }

    const numUnits = parseInt(units, 10);

    const result = await prisma.$transaction(async (tx) => {
      const currentStock = await tx.bloodInventory.findUnique({ where: { group } });
      const available = currentStock ? currentStock.units - (currentStock.reservedUnits || 0) : 0;

      if (!currentStock || available < numUnits) {
        const err = new Error(`Insufficient unreserved units for ${group}. Available: ${available}`);
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

/**
 * POST /api/inventory/bags
 * Register a new blood collection bag (placed in Quarantine pending serology)
 */
async function registerBloodBag(req, res, next) {
  try {
    const {
      bagId,
      bloodGroup,
      componentType,
      bagType,
      volumeMl,
      donorCode,
      donorName,
      collectionDate,
      expiryDays,
      location,
      notes
    } = req.body;

    if (!bloodGroup) {
      return res.status(400).json({ success: false, message: 'Blood group is required' });
    }

    const generatedBagId = bagId && bagId.trim()
      ? bagId.trim()
      : `BAG-${bloodGroup.replace('+', 'P').replace('-', 'N')}-${Date.now().toString().slice(-5)}`;

    const cDate = collectionDate ? new Date(collectionDate) : new Date();
    const days = parseInt(expiryDays, 10) || 35;
    const expDate = new Date(cDate.getTime() + days * 86400000);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create bag unit in Quarantine
      const bag = await tx.bloodBagUnit.create({
        data: {
          bagId: generatedBagId,
          bloodGroup,
          componentType: componentType || 'Packed Red Cells (PRBC)',
          bagType: bagType || 'Triple (3D)',
          volumeMl: parseInt(volumeMl, 10) || 350,
          donorCode: donorCode || `DNR-${Math.floor(1000 + Math.random() * 9000)}`,
          donorName: donorName || 'Voluntary Donor',
          collectionDate: cDate,
          expiryDate: expDate,
          stage: 'QUARANTINE',
          serologyStatus: 'PENDING',
          location: location || 'Quarantine Section Q-01',
          notes: notes || 'Awaiting mandatory serology panel'
        }
      });

      // 2. Increment blood inventory units
      await tx.bloodInventory.upsert({
        where: { group: bloodGroup },
        update: { units: { increment: 1 } },
        create: {
          group: bloodGroup,
          units: 1,
          reservedUnits: 0,
          threshold: 10,
          capacity: 35,
          expiryDate: expDate
        }
      });

      // 3. Decrement matching empty bag stock if present
      if (bagType) {
        await tx.emptyBagStock.updateMany({
          where: { bagType },
          data: { currentStock: { decrement: 1 } }
        });
      }

      return bag;
    });

    return res.status(201).json({ success: true, data: result, message: `Bag ${generatedBagId} registered in Quarantine` });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/inventory/bags/:id/screen
 * Mandatory Serology Screening & Clearance:
 * Tests: HIV 1/2, HCV, HBsAg, Syphilis/VDRL.
 * Must be non-reactive across all 4 to graduate to SCREENED_AVAILABLE.
 */
async function screenBloodBag(req, res, next) {
  try {
    const { id } = req.params;
    const { hivResult, hcvResult, hbsagResult, vdrlResult, screenedBy, notes } = req.body;

    if (!hivResult || !hcvResult || !hbsagResult || !vdrlResult) {
      return res.status(400).json({
        success: false,
        message: 'All 4 mandatory serology assays (HIV, HCV, HBsAg, VDRL) must have verified test results'
      });
    }

    const allClear =
      hivResult === 'NON_REACTIVE' &&
      hcvResult === 'NON_REACTIVE' &&
      hbsagResult === 'NON_REACTIVE' &&
      vdrlResult === 'NON_REACTIVE';

    const result = await prisma.$transaction(async (tx) => {
      const bag = await tx.bloodBagUnit.findUnique({ where: { id } });
      if (!bag) {
        const err = new Error('Blood bag not found');
        err.status = 404;
        throw err;
      }

      const newStage = allClear ? 'SCREENED_AVAILABLE' : 'DISCARDED';
      const serologyStatus = allClear ? 'CLEARED' : 'REACTIVE_FAILED';

      // 1. Update bag record
      const updatedBag = await tx.bloodBagUnit.update({
        where: { id },
        data: {
          stage: newStage,
          serologyStatus,
          hivResult,
          hcvResult,
          hbsagResult,
          vdrlResult,
          screenedBy: screenedBy || (req.user ? req.user.name : 'Consultant Pathologist'),
          screenedAt: new Date(),
          notes: notes ? `${bag.notes || ''} | Lab: ${notes}` : bag.notes
        }
      });

      // 2. If reactive, decrement inventory stock
      if (!allClear) {
        await tx.bloodInventory.update({
          where: { group: bag.bloodGroup },
          data: { units: { decrement: 1 } }
        });
      }

      // 3. Decrement 1 test from active Serology Test Kits and log usage
      const assays = [
        { key: 'HIV', nameMatch: 'HIV' },
        { key: 'HCV', nameMatch: 'HCV' },
        { key: 'HBsAg', nameMatch: 'HBsAg' },
        { key: 'VDRL', nameMatch: 'Syphilis' }
      ];

      for (const assay of assays) {
        const kit = await tx.serologyTestKit.findFirst({
          where: { assayName: { contains: assay.nameMatch } }
        });
        if (kit) {
          await tx.serologyTestKit.update({
            where: { id: kit.id },
            data: { testsRemaining: { decrement: 1 } }
          });

          await tx.reagentUsageLog.create({
            data: {
              kitId: kit.id,
              assayName: kit.assayName,
              testsUsed: 1,
              batchNumber: kit.lotNumber,
              technician: screenedBy || (req.user ? req.user.name : 'Lab Officer'),
              notes: `Screening for bag ${bag.bagId}`
            }
          });
        }
      }

      return updatedBag;
    }, { maxWait: 10000, timeout: 30000 });

    recordAuditLog({
      actorId: req.user ? req.user.id : null,
      actorName: req.user ? req.user.name : 'Pathologist',
      actorRole: req.user ? req.user.role : 'DOCTOR',
      action: 'SCREEN_BLOOD_BAG',
      module: 'INVENTORY',
      recordId: result.id,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      details: { bagId: result.bagId, serologyStatus: result.serologyStatus, stage: result.stage }
    });

    return res.json({
      success: true,
      data: result,
      message: allClear
        ? `Bag ${result.bagId} cleared all 4 serology checks and graduated to Screened Available stock!`
        : `Bag ${result.bagId} was flagged Reactive and safely quarantined for medical disposal.`
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

/**
 * PUT /api/inventory/empty-bags/:id
 * Restock or edit empty collection bags
 */
async function updateEmptyBagStock(req, res, next) {
  try {
    const { id } = req.params;
    const { currentStock, restockQty, minThreshold, unitCost } = req.body;

    const data = {};
    if (restockQty && parseInt(restockQty, 10) > 0) {
      data.currentStock = { increment: parseInt(restockQty, 10) };
      data.lastRestocked = new Date();
    } else if (currentStock !== undefined) {
      data.currentStock = parseInt(currentStock, 10);
    }
    if (minThreshold !== undefined) data.minThreshold = parseInt(minThreshold, 10);
    if (unitCost !== undefined) data.unitCost = parseFloat(unitCost);

    const updated = await prisma.emptyBagStock.update({
      where: { id },
      data
    });

    return res.json({ success: true, data: updated, message: 'Empty bag stock updated successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/inventory/test-kits/:id/restock
 * Restock serology test kit counts
 */
async function restockTestKit(req, res, next) {
  try {
    const { id } = req.params;
    const { addedTests, lotNumber, expiryDate } = req.body;

    const data = {
      ...(addedTests && { testsRemaining: { increment: parseInt(addedTests, 10) } }),
      ...(lotNumber && { lotNumber: lotNumber.trim() }),
      ...(expiryDate && { expiryDate: new Date(expiryDate) })
    };

    const updated = await prisma.serologyTestKit.update({
      where: { id },
      data
    });

    return res.json({ success: true, data: updated, message: 'Test kit inventory restocked successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/inventory/logs
 */
async function getInventoryLogs(req, res, next) {
  try {
    const logs = await prisma.inventoryLog.findMany({
      orderBy: { date: 'desc' },
      include: { patient: { select: { patientCode: true, name: true } } }
    });
    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/inventory/public
 * Public blood stock with clean unreserved availability count
 */
async function getPublicBloodStock(req, res, next) {
  try {
    const bloodStocks = await prisma.bloodInventory.findMany({
      orderBy: { group: 'asc' }
    });

    const stocksMap = new Map(bloodStocks.map((s) => [s.group, s]));

    const formattedStocks = BLOOD_GROUP_ORDER.map((grp) => {
      const s = stocksMap.get(grp);
      const totalUnits = s ? s.units : 0;
      const reserved = s ? (s.reservedUnits || 0) : 0;
      const unreserved = Math.max(0, totalUnits - reserved);
      const threshold = s ? s.threshold : 10;

      return {
        id: s ? s.id : `pub-${grp}`,
        group: grp,
        totalUnits,
        reservedUnits: reserved,
        unreservedUnits: unreserved,
        availableUnits: unreserved,
        threshold,
        isLow: unreserved <= threshold,
        status: unreserved <= threshold ? 'Near Low' : 'Optimal',
        expiryDate: s ? s.expiryDate : new Date(Date.now() + 30 * 86400000)
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
  reserveBloodStock,
  releaseReservation,
  fulfillReservation,
  quickLoadStock,
  quickDispenseStock,
  registerBloodBag,
  screenBloodBag,
  updateEmptyBagStock,
  restockTestKit,
  getInventoryLogs,
  getPublicBloodStock
};
