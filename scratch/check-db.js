const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    host: '18.196.8.182',
    port: 5432,
    user: 'postgres.rpdmrgyanwkotikhkouo',
    password: '@Ayomide1994',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false,
      servername: 'aws-1-eu-central-1.pooler.supabase.com'
    }
  });

  try {
    await client.connect();
    console.log("Connected to database successfully!");

    // Query notifications table columns
    const resNotifications = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'notifications'
    `);
    console.log("\n--- Columns in 'notifications' table ---");
    resNotifications.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    // Query messages table columns
    const resMessages = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'messages'
    `);
    console.log("\n--- Columns in 'messages' table ---");
    resMessages.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

    // Query members table columns
    const resMembers = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'members'
    `);
    console.log("\n--- Columns in 'members' table ---");
    resMembers.rows.forEach(row => {
      console.log(`${row.column_name}: ${row.data_type}`);
    });

  } catch (err) {
    console.error("Database connection/query error:", err);
  } finally {
    await client.end();
  }
}

main();
