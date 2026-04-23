const fs = require('fs');
const { createClient } = require('@libsql/client');
require('dotenv').config();

async function pushToTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Turso credentials missing');
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  try {
    console.log('Connecting to Turso...');
    
    console.log('Reading setup-sqlite.sql...');
    let sql = fs.readFileSync('prisma/setup-sqlite.sql');
    
    // Check for UTF-16LE BOM
    if (sql[0] === 0xff && sql[1] === 0xfe) {
      sql = sql.toString('utf16le');
    } else {
      sql = sql.toString('utf8');
    }
    // Strip BOM
    sql = sql.replace(/^\uFEFF/, '');

    console.log('Executing schema push on Turso...');
    
    // libSQL executeMultiple allows running multiple statements separated by semicolon
    await client.executeMultiple(sql);
    console.log('Schema pushed successfully to Turso!');
  } catch (error) {
    console.error('Error pushing schema to Turso:', error);
    process.exit(1);
  }
}

pushToTurso();
