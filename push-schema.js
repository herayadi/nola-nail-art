const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

async function pushSchema() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No connection string found');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Neon
  });

  try {
    console.log('Connecting to Neon via pg...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Reading setup.sql...');
    // Setup.sql might be UTF-16LE, let's read it properly
    let sql = fs.readFileSync('prisma/setup.sql');
    
    // Check for UTF-16LE BOM
    if (sql[0] === 0xff && sql[1] === 0xfe) {
      sql = sql.toString('utf16le');
    } else {
      sql = sql.toString('utf8');
    }

    console.log('Executing schema push...');
    await client.query(sql);
    console.log('Schema pushed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

pushSchema();
