const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check(table) {
  console.log(`Checking table: ${table}`);
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (error) {
    console.error(`Error ${table}:`, error.message);
    return;
  }
  if (data && data.length > 0) {
    console.log(`${table} columns:`, Object.keys(data[0]));
  } else {
    // If no data, try to insert and catch the error to see what columns are expected?
    // Or just say it's empty.
    console.log(`${table} is empty.`);
  }
}

async function run() {
  await check('members');
  await check('donations');
  await check('posts');
  await check('events');
  await check('sermons');
  await check('profiles');
  await check('rsvps');
  await check('notifications');
}

run();
