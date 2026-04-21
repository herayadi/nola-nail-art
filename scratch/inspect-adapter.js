const adapter = require('@prisma/adapter-better-sqlite3');
console.log('Adapter Exports:', Object.keys(adapter));
console.log('PrismaBetterSqlite3 type:', typeof adapter.PrismaBetterSqlite3);
