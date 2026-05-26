const { Client } = require('pg');

async function getMembersDonations() {
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

    // Query donations
    const res = await client.query(`
      SELECT donor_email, SUM(amount) as total_amount
      FROM donations
      WHERE status = 'completed'
      GROUP BY donor_email
      ORDER BY total_amount DESC
    `);

    console.log("\n--- Donation Totals by Email ---");
    res.rows.forEach(row => {
      console.log(`${row.donor_email || 'Unknown'}: ${row.total_amount}`);
    });
    console.log("--------------------------------");

  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.end();
  }
}

getMembersDonations();
