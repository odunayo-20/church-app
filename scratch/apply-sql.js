const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const sqlPath = path.join(__dirname, '..', 'supabase-messages-setup.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log("Reading SQL setup from:", sqlPath);

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

    console.log("Executing SQL...");
    await client.query(sqlContent);
    console.log("SQL executed successfully!");

  } catch (err) {
    console.error("Error executing SQL:", err);
  } finally {
    await client.end();
  }
}

main();
