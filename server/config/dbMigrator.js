const { execSync } = require('child_process');
const path = require('path');
const prisma = require('./db');

async function autoMigrate() {
  console.log('[AutoMigrate] Checking database schema synchronization...');
  try {
    // 1. Check if User table exists
    const usersCount = await prisma.user.count().catch(() => null);

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
    console.error('[AutoMigrate] Warning or migration error:', err.message);
  }
}

module.exports = { autoMigrate };
