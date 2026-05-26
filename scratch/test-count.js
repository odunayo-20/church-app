const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const result = await supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "completed");
  console.log("Donation Count Result:", result);
}
test();
