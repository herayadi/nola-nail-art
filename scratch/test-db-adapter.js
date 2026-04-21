const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const Database = require('better-sqlite3');
const path = require('path');

async function test() {
  const dbPath = path.resolve(__dirname, '../prisma/dev.db');
  console.log('Using DB at:', dbPath);
  
  const sqlite = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(sqlite);
  const prisma = new PrismaClient({ adapter });

  try {
    const slots = await prisma.timeSlot.findMany();
    console.log('✅ Slots found:', slots.length);
    console.log('Preview:', slots.slice(0, 2));
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
