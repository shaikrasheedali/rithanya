const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
require('../utils/dbEnv');
const prisma = require('./db');
const { seedDatabase } = require('../prisma/seed');
const { syncProductionMasterData } = require('./masterCatalogSeeder');

/**
 * Parses MySQL connection configuration from GoDaddy environment variables or DATABASE_URL
 */
function getDbConnectionConfig() {
  if (process.env.DB_HOST && process.env.DB_NAME) {
    return {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      multipleStatements: true
    };
  }

  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const isSsl = url.searchParams.get('ssl-mode') || url.searchParams.get('sslmode');
      return {
        host: url.hostname,
        port: parseInt(url.port || '3306', 10),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        multipleStatements: true
      };
    } catch (e) {
      console.warn('[AutoMigrate] Warning: Could not parse DATABASE_URL string as URL object:', e.message);
    }
  }

  return null;
}

/**
 * Robust database auto-migration and table builder
 * Automatically checks connectivity, creates missing tables via Prisma or direct SQL DDL fallback,
 * and seeds initial master records if database is fresh.
 */
async function autoMigrate() {
  console.log('[AutoMigrate] Checking database schema synchronization...');

  // 1. Verify basic database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[AutoMigrate] ✓ Database connectivity established.');
  } catch (connErr) {
    console.warn('[AutoMigrate] Notice: Unable to connect to MySQL database:', connErr.message);
    console.warn('[AutoMigrate] Ensure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (or DATABASE_URL) are configured in environment variables.');
    return;
  }

  // 2. Check existing tables
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

  // 3. If database is empty or User table does not exist, build all tables!
  if (tablesCount === 0 || !hasUserTable) {
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
      console.warn('[AutoMigrate] Prisma CLI execution failed or unsupported in this environment:', cliErr.message);
    }

    // Strategy 2: Direct SQL DDL fallback via mysql2
    if (!migrationSuccess) {
      console.log('[AutoMigrate] Executing fallback: Direct SQL table creation via mysql2 driver...');
      const initSqlPath = path.join(__dirname, '../prisma/init.sql');

      if (fs.existsSync(initSqlPath)) {
        const sqlContent = fs.readFileSync(initSqlPath, 'utf8');
        const dbConfig = getDbConnectionConfig();

        if (dbConfig) {
          let connection;
          try {
            connection = await mysql.createConnection(dbConfig);
            console.log('[AutoMigrate] Connected to MySQL via mysql2. Creating tables...');

            await connection.query('SET FOREIGN_KEY_CHECKS = 0;');

            // Split into individual statements
            const statements = sqlContent
              .split(/;\s*[\r\n]+/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0 && !s.startsWith('--'));

            for (const stmt of statements) {
              try {
                await connection.query(stmt);
              } catch (stmtErr) {
                // Ignore benign "already exists" errors
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
        } else {
          console.warn('[AutoMigrate] Could not determine MySQL connection parameters for fallback.');
        }
      } else {
        console.warn(`[AutoMigrate] init.sql not found at ${initSqlPath}`);
      }
    }
  }

  // 4. Check if database records need to be seeded
  let usersCount = 0;
  try {
    usersCount = await prisma.user.count();
  } catch {
    usersCount = 0;
  }

  if (usersCount === 0) {
    console.log('[AutoMigrate] Database is empty. Seeding initial admin users and master data...');
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
  } else {
    console.log(`[AutoMigrate] ✓ Database schema verified. Active users: ${usersCount}.`);
  }

  // 5. Ensure legacy domain emails are migrated to rithanyahospital.com
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

  // 6. Verify and ensure Specialist table columns (slug, registrationNumber, content) exist
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

  // 7. Synchronize production master catalog: exact 6 treatments & faculty doctors
  try {
    await syncProductionMasterData(prisma);
  } catch (syncErr) {
    console.warn('[AutoMigrate] Notice during master catalog sync:', syncErr.message);
  }
}

module.exports = { autoMigrate, getDbConnectionConfig };
