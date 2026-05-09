const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  const tables = ['members', 'posts', 'sermons', 'events', 'donations', 'notifications', 'profiles'];

  for (const table of tables) {
    console.log(`\nTable: ${table}`);
    const res = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position;
    `, [table]);
    
    if (res.rows.length === 0) {
      console.log('  (Table not found or no columns)');
    } else {
      res.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type}) DEFAULT ${row.column_default}`);
      });
    }
  }

  await client.end();
}

run().catch(console.error);
