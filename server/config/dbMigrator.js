const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
require('../utils/dbEnv');
const prisma = require('./db');
const { getDbConfig } = require('./mysqlConnection');
const { seedDatabase } = require('../prisma/seed');
const { syncProductionMasterData } = require('./masterCatalogSeeder');

/**
 * Restores all hospital master data (doctors, treatments, services, media, blood bank, settings)
 * from the Aiven migration dump into the target GoDaddy database.
 */
async function restoreFromMasterDump(prismaClient) {
  const dumpPath = path.join(__dirname, '../prisma/productionMasterDump.json');
  if (!fs.existsSync(dumpPath)) return false;

  console.log('[AutoMigrate] Found production master dump. Restoring all hospital records to database...');
  try {
    const data = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

    // 1. Users (Superadmin, Admin, Staff with verified Argon2 hashes)
    if (Array.isArray(data.users)) {
      for (const u of data.users) {
        const exists = await prismaClient.user.findFirst({
          where: { OR: [{ id: u.id }, { email: u.email }] }
        });
        if (!exists) {
          await prismaClient.user.create({ data: u }).catch((e) => console.warn('[Dump Restore] User note:', e.message));
        }
      }
    }

    // 2. Staff Profiles
    if (Array.isArray(data.staff)) {
      for (const s of data.staff) {
        const exists = await prismaClient.staff.findFirst({
          where: { OR: [{ id: s.id }, { staffCode: s.staffCode }] }
        });
        if (!exists) {
          await prismaClient.staff.create({ data: s }).catch((e) => console.warn('[Dump Restore] Staff note:', e.message));
        }
      }
    }

    // 3. Specialists / Doctors
    if (Array.isArray(data.specialists)) {
      for (const spec of data.specialists) {
        const exists = await prismaClient.specialist.findFirst({
          where: { OR: [{ id: spec.id }, { slug: spec.slug }] }
        });
        if (!exists) {
          await prismaClient.specialist.create({ data: spec }).catch((e) => console.warn('[Dump Restore] Doctor note:', e.message));
        }
      }
    }

    // 4. Treatments
    if (Array.isArray(data.treatments)) {
      for (const t of data.treatments) {
        const exists = await prismaClient.treatment.findFirst({
          where: { OR: [{ id: t.id }, { slug: t.slug }] }
        });
        if (!exists) {
          await prismaClient.treatment.create({ data: t }).catch((e) => console.warn('[Dump Restore] Treatment note:', e.message));
        }
      }
    }

    // 5. Services
    if (Array.isArray(data.services)) {
      for (const s of data.services) {
        const exists = await prismaClient.service.findFirst({
          where: { OR: [{ id: s.id }, { slug: s.slug }] }
        });
        if (!exists) {
          await prismaClient.service.create({ data: s }).catch((e) => console.warn('[Dump Restore] Service note:', e.message));
        }
      }
    }

    // 6. Product Packages
    if (Array.isArray(data.productPackages)) {
      for (const p of data.productPackages) {
        const exists = await prismaClient.productPackage.findFirst({
          where: { OR: [{ id: p.id }, { slug: p.slug }] }
        });
        if (!exists) {
          await prismaClient.productPackage.create({ data: p }).catch((e) => console.warn('[Dump Restore] Package note:', e.message));
        }
      }
    }

    // 7. Gallery Items
    if (Array.isArray(data.galleryItems)) {
      for (const g of data.galleryItems) {
        const exists = await prismaClient.galleryItem.findUnique({ where: { id: g.id } });
        if (!exists) {
          await prismaClient.galleryItem.create({ data: g }).catch((e) => console.warn('[Dump Restore] Gallery note:', e.message));
        }
      }
    }

    // 8. Media Assets (images & documents with base64 for resilient disk rehydration)
    if (Array.isArray(data.mediaAssets)) {
      for (const m of data.mediaAssets) {
        const exists = await prismaClient.mediaAsset.findFirst({
          where: { OR: [{ id: m.id }, { filename: m.filename }] }
        });
        if (!exists) {
          await prismaClient.mediaAsset.create({ data: m }).catch((e) => console.warn('[Dump Restore] Media note:', e.message));
        }
      }
    }

    // 9. Blood Inventory Units
    if (Array.isArray(data.bloodInventory)) {
      for (const b of data.bloodInventory) {
        const exists = await prismaClient.bloodInventory.findFirst({
          where: { OR: [{ id: b.id }, { bloodGroup: b.bloodGroup }] }
        });
        if (!exists) {
          await prismaClient.bloodInventory.create({ data: b }).catch((e) => console.warn('[Dump Restore] Blood note:', e.message));
        }
      }
    }

    // 10. Hospital Master Settings
    if (Array.isArray(data.hospitalSettings)) {
      for (const st of data.hospitalSettings) {
        const exists = await prismaClient.hospitalSetting.findUnique({ where: { key: st.key } });
        if (!exists) {
          await prismaClient.hospitalSetting.create({ data: st }).catch((e) => console.warn('[Dump Restore] Setting note:', e.message));
        }
      }
    }

    // 11. Serology Test Kits & Empty Bags
    if (Array.isArray(data.serologyTestKits)) {
      for (const k of data.serologyTestKits) {
        const exists = await prismaClient.serologyTestKit.findUnique({ where: { id: k.id } });
        if (!exists) {
          await prismaClient.serologyTestKit.create({ data: k }).catch((e) => console.warn('[Dump Restore] Kit note:', e.message));
        }
      }
    }

    if (Array.isArray(data.emptyBagStocks)) {
      for (const eb of data.emptyBagStocks) {
        const exists = await prismaClient.emptyBagStock.findUnique({ where: { id: eb.id } });
        if (!exists) {
          await prismaClient.emptyBagStock.create({ data: eb }).catch((e) => console.warn('[Dump Restore] Empty bag note:', e.message));
        }
      }
    }

    console.log('[AutoMigrate] ✓ Production master dump restored successfully into database.');
    return true;
  } catch (err) {
    console.warn('[AutoMigrate] Notice during dump restore:', err.message);
    return false;
  }
}

/**
 * Robust database auto-migration and table builder
 * Automatically checks connectivity, creates missing tables via Prisma or direct SQL DDL fallback,
 * and seeds initial master records if database is fresh.
 */
async function autoMigrate() {
  console.log('[AutoMigrate] Checking GoDaddy MySQL database schema synchronization...');

  // 1. Ensure target database exists on GoDaddy host
  const dbConfig = getDbConfig();
  if (dbConfig.host && dbConfig.database) {
    try {
      const adminConn = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        charset: 'utf8mb4',
        multipleStatements: true
      });
      await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      await adminConn.end();
    } catch (_) {
      // Proceed if user doesn't have CREATE DATABASE privilege (e.g. database pre-created by GoDaddy cPanel)
    }
  }

  // 2. Verify basic database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[AutoMigrate] ✓ GoDaddy MySQL database connectivity established.');
  } catch (connErr) {
    console.warn('[AutoMigrate] Notice: Unable to connect to MySQL database:', connErr.message);
    console.warn('[AutoMigrate] Ensure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are configured in GoDaddy environment variables.');
    return;
  }

  // 3. Check existing tables
  let tablesCount = 0;
  let hasUserTable = false;

  try {
    const rawTables = await prisma.$queryRawUnsafe('SHOW TABLES');
    tablesCount = Array.isArray(rawTables) ? rawTables.length : 0;
  } catch (e) {
    console.warn('[AutoMigrate] SHOW TABLES query check note:', e.message);
  }

  if (tablesCount > 0) {
    try {
      await prisma.user.count();
      hasUserTable = true;
    } catch (e) {
      hasUserTable = false;
    }
  }

  console.log(`[AutoMigrate] Database state: ${tablesCount} tables present. User table exists: ${hasUserTable}`);

  // 4. If database is empty or User table does not exist, build all tables!
  if (tablesCount < 20 || !hasUserTable) {
    console.log('[AutoMigrate] Missing tables detected. Building complete schema tables...');
    let migrationSuccess = false;

    // Strategy 1: Local Prisma CLI execution via Node runtime
    try {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      let prismaBin;
      try {
        prismaBin = require.resolve('prisma/build/index.js');
      } catch {
        prismaBin = path.join(__dirname, '../node_modules/prisma/build/index.js');
      }

      console.log(`[AutoMigrate] Running Prisma db push via local binary...`);
      execSync(`"${process.execPath}" "${prismaBin}" db push --schema="${schemaPath}" --accept-data-loss --skip-generate`, {
        stdio: 'inherit',
        env: process.env,
        timeout: 90000
      });
      console.log('[AutoMigrate] ✓ Schema push completed successfully via Prisma CLI.');
      migrationSuccess = true;
    } catch (cliErr) {
      console.warn('[AutoMigrate] Prisma CLI execution note in this environment:', cliErr.message);
    }

    // Strategy 2: Direct SQL DDL execution via mysql2
    if (!migrationSuccess) {
      console.log('[AutoMigrate] Executing direct SQL table creation via official mysql2 driver...');
      const initSqlPath = path.join(__dirname, '../prisma/init.sql');

      if (fs.existsSync(initSqlPath)) {
        const sqlContent = fs.readFileSync(initSqlPath, 'utf8');

        if (dbConfig) {
          let connection;
          try {
            connection = await mysql.createConnection({
              ...dbConfig,
              multipleStatements: true
            });
            console.log('[AutoMigrate] Connected to MySQL via mysql2. Creating tables...');

            await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

            // Split into individual statements
            const statements = sqlContent
              .split(/;\s*[\r\n]+/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0 && !s.startsWith('--'));

            for (let stmt of statements) {
              try {
                // Ensure IF NOT EXISTS for safe idempotency
                if (stmt.startsWith('CREATE TABLE `')) {
                  stmt = stmt.replace('CREATE TABLE `', 'CREATE TABLE IF NOT EXISTS `');
                }
                await connection.query(stmt);
              } catch (stmtErr) {
                if (!stmtErr.message.includes('already exists') && !stmtErr.message.includes('Duplicate key')) {
                  console.warn('[AutoMigrate] DDL notice:', stmtErr.message);
                }
              }
            }

            await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
            console.log(`[AutoMigrate] ✓ Direct SQL table creation finished (${statements.length} statements executed).`);
            migrationSuccess = true;
          } catch (sqlErr) {
            console.error('[AutoMigrate] Direct SQL execution failed:', sqlErr.message);
          } finally {
            if (connection) {
              await connection.end();
            }
          }
        }
      }
    }
  }

  // 5. Check if database records need to be seeded or restored
  let usersCount = 0;
  try {
    usersCount = await prisma.user.count();
  } catch {
    usersCount = 0;
  }

  if (usersCount === 0) {
    console.log('[AutoMigrate] Database is empty. Restoring from production master dump or seeding initial data...');
    let restored = false;
    try {
      restored = await restoreFromMasterDump(prisma);
    } catch (e) {
      restored = false;
    }

    if (!restored) {
      console.log('[AutoMigrate] Running initial seedDatabase fallback...');
      try {
        await seedDatabase();
        console.log('[AutoMigrate] ✓ Initial hospital records and credentials seeded successfully in-process.');
      } catch (seedErr) {
        console.warn('[AutoMigrate] In-process seed failed, executing seed.js in child process:', seedErr.message);
        try {
          const seedPath = path.join(__dirname, '../prisma/seed.js');
          execSync(`"${process.execPath}" "${seedPath}"`, {
            stdio: 'inherit',
            env: process.env
          });
          console.log('[AutoMigrate] ✓ Seed process completed successfully.');
        } catch (childErr) {
          console.error('[AutoMigrate] Child process seed error:', childErr.message);
        }
      }
    }
  } else {
    console.log(`[AutoMigrate] ✓ Database schema verified. Active users: ${usersCount}.`);
  }

  // 6. Ensure legacy domain emails are migrated to rithanyahospital.com
  try {
    const existingNewAdmin = await prisma.user.findUnique({ where: { email: 'admin@rithanyahospital.com' } });
    if (existingNewAdmin) {
      await prisma.user.deleteMany({ where: { email: 'admin@rithanya.in' } });
    } else {
      await prisma.user.updateMany({
        where: { email: 'admin@rithanya.in' },
        data: { email: 'admin@rithanyahospital.com' }
      });
    }

    const existingNewStaff = await prisma.user.findUnique({ where: { email: 'staff@rithanyahospital.com' } });
    if (existingNewStaff) {
      await prisma.user.deleteMany({ where: { email: 'staff@rithanya.in' } });
    } else {
      await prisma.user.updateMany({
        where: { email: 'staff@rithanya.in' },
        data: { email: 'staff@rithanyahospital.com' }
      });
    }
  } catch {
    // Ignore migration error if schema not initialized
  }

  // 7. Verify and ensure Specialist table columns (slug, registrationNumber, content) exist
  try {
    const specialistColumns = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Specialist'
    `);
    const colNames = Array.isArray(specialistColumns) ? specialistColumns.map((c) => c.COLUMN_NAME) : [];

    if (colNames.length > 0) {
      if (!colNames.includes('slug')) {
        console.log('[AutoMigrate] Adding missing `slug` column to Specialist table...');
        await prisma.$executeRawUnsafe(`ALTER TABLE \`Specialist\` ADD COLUMN \`slug\` VARCHAR(191) NULL`);
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE \`Specialist\` ADD UNIQUE INDEX \`Specialist_slug_key\`(\`slug\`)`);
        } catch (_) {}
      }
      if (!colNames.includes('registrationNumber')) {
        console.log('[AutoMigrate] Adding missing `registrationNumber` column to Specialist table...');
        await prisma.$executeRawUnsafe(`ALTER TABLE \`Specialist\` ADD COLUMN \`registrationNumber\` VARCHAR(191) NULL`);
      }
      if (!colNames.includes('content')) {
        console.log('[AutoMigrate] Adding missing `content` column to Specialist table...');
        await prisma.$executeRawUnsafe(`ALTER TABLE \`Specialist\` ADD COLUMN \`content\` LONGTEXT NULL`);
      }

      // Backfill any missing specialist slugs
      const unslugged = await prisma.specialist.findMany({ where: { slug: null } });
      for (const spec of unslugged) {
        const generatedSlug = spec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await prisma.specialist.update({
          where: { id: spec.id },
          data: { slug: generatedSlug || `specialist-${spec.id.slice(0, 8)}` }
        });
      }
    }
  } catch (colErr) {
    console.warn('[AutoMigrate] Note during Specialist column verification:', colErr.message);
  }

  // 8. Verify and ensure ProductPackage table columns (videoUrl, content) exist
  try {
    const productColumns = await prisma.$queryRawUnsafe(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductPackage'
    `);
    const pColNames = Array.isArray(productColumns) ? productColumns.map((c) => c.COLUMN_NAME) : [];

    if (pColNames.length > 0) {
      if (!pColNames.includes('videoUrl')) {
        console.log('[AutoMigrate] Adding missing `videoUrl` column to ProductPackage table...');
        await prisma.$executeRawUnsafe(`ALTER TABLE \`ProductPackage\` ADD COLUMN \`videoUrl\` VARCHAR(1000) NULL`);
      }
      if (!pColNames.includes('content')) {
        console.log('[AutoMigrate] Adding missing `content` column to ProductPackage table...');
        await prisma.$executeRawUnsafe(`ALTER TABLE \`ProductPackage\` ADD COLUMN \`content\` LONGTEXT NULL`);
      }
    }
  } catch (pColErr) {
    console.warn('[AutoMigrate] Note during ProductPackage column verification:', pColErr.message);
  }

  // 9. Synchronize production master catalog: exact 40 treatments & faculty doctors
  try {
    await syncProductionMasterData(prisma);
  } catch (syncErr) {
    console.warn('[AutoMigrate] Notice during master catalog sync:', syncErr.message);
  }
}

module.exports = { autoMigrate, getDbConnectionConfig: getDbConfig };
