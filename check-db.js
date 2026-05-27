const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.rpdmrgyanwkotikhkouo:@Ayomide1994@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
});

async function main() {
  await client.connect();
  console.log("Connected to Supabase PostgreSQL!");
  
  const resProfiles = await client.query(`
    SELECT email, role FROM profiles;
  `);
  
  console.log("Profiles:");
  console.log(resProfiles.rows);

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
