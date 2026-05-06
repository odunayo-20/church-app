const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

async function check() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  console.log("Checking profiles table...");
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Error fetching profiles:", error);
  } else {
    console.log("Profiles found:", JSON.stringify(data, null, 2));
  }
}

check();
