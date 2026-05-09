import { createClient } from "./lib/supabase/server";

async function checkSchema() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("members").select("*").limit(1);
  if (error) {
    console.error("Error fetching member:", error);
    return;
  }
  if (data && data.length > 0) {
    console.log("Member columns:", Object.keys(data[0]));
  } else {
    console.log("No members found to check columns.");
  }
}

checkSchema();
