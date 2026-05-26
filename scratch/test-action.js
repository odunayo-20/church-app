require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testAction() {
  const now = new Date().toISOString();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const results = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("donations").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("date", now),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("rsvps").select("*", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("donations").select("paidAt, amount").eq("status", "completed").gte("paidAt", startOfMonth.toISOString()).order("paidAt", { ascending: true }),
    supabase.from("donations").select("*, member:members(name)").eq("status", "completed").order("paidAt", { ascending: false }).limit(5),
    supabase.from("events").select("*").gte("date", now).order("date", { ascending: true }).limit(5),
    supabase.from("donations").select("amount").eq("status", "completed"),
  ]);

  results.forEach((r, i) => {
    console.log(`Query ${i}: count=${r.count}, error=${r.error ? r.error.message : 'none'}, dataLength=${r.data ? r.data.length : 'null'}`);
  });
}
testAction();
