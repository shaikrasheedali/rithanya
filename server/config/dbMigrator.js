const { execSync } = require('child_process');
const path = require('path');
require('../utils/dbEnv');
const prisma = require('./db');

async function autoMigrate() {
  console.log('[AutoMigrate] Checking database schema synchronization...');
  try {
    // Check basic database connectivity first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (connErr) {
      console.warn('[AutoMigrate] Notice: Unable to connect to MySQL database:', connErr.message);
      console.warn('[AutoMigrate] Ensure DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (or DATABASE_URL) are configured correctly.');
      return;
    }

    // 1. Check if User table exists
    let usersCount = null;
    try {
      usersCount = await prisma.user.count();
    } catch (e) {
      // Table doesn't exist yet
      usersCount = null;
    }

    if (usersCount === null) {
      console.log('[AutoMigrate] Tables missing or outdated. Running Prisma DB push...');
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
        stdio: 'inherit',
        env: process.env
      });
      console.log('[AutoMigrate] Schema push completed successfully.');

      console.log('[AutoMigrate] Database unpopulated. Running database seed...');
      const seedPath = path.join(__dirname, '../prisma/seed.js');
      execSync(`node "${seedPath}"`, {
        stdio: 'inherit',
        env: process.env
      });
      console.log('[AutoMigrate] Database seeded successfully.');
    } else if (usersCount === 0) {
      console.log('[AutoMigrate] Tables exist but User table is empty. Running seed...');
      const seedPath = path.join(__dirname, '../prisma/seed.js');
      execSync(`node "${seedPath}"`, {
        stdio: 'inherit',
        env: process.env
      });
      console.log('[AutoMigrate] Seed completed.');
    } else {
      console.log(`[AutoMigrate] Database schema verified. Active users found: ${usersCount}.`);
    }
  } catch (err) {
    console.error('[AutoMigrate] Migration note:', err.message);
  }
}

module.exports = { autoMigrate };
