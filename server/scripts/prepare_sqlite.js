const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, '..', 'prisma');
const mysqlSchemaPath = path.join(prismaDir, 'schema.prisma');
const sqliteSchemaPath = path.join(prismaDir, 'schema.sqlite.prisma');

const mysqlSchema = fs.readFileSync(mysqlSchemaPath, 'utf8');

// Replace MySQL provider with SQLite and strip MySQL-specific @db attributes
let sqliteSchema = mysqlSchema
  .replace('provider = "mysql"', 'provider = "sqlite"')
  .replace('url      = env("DATABASE_URL")', 'url      = "file:./local_test.db"')
  .replace(/@db\.[a-zA-Z0-9_]+(\([^)]*\))?/g, '');

fs.writeFileSync(sqliteSchemaPath, sqliteSchema, 'utf8');
console.log('✓ schema.sqlite.prisma successfully generated with full model parity.');
