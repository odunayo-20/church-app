const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetch a member
  const { data: members, error: memError } = await supabase
    .from('members')
    .select('*')
    .limit(1);

  if (memError || !members || members.length === 0) {
    console.error("Error fetching member:", memError);
    return;
  }

  const member = members[0];
  console.log("Found member:", member);

  // Let's inspect the keys (column names) of the member object
  console.log("Member keys:", Object.keys(member));

  // Let's try to insert a test notification using camelCase keys
  const camelCasePayload = {
    id: globalThis.crypto.randomUUID(),
    memberId: member.id,
    type: 'birthday',
    message: 'Test camelCase notification',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  console.log("Trying insert with camelCase payload...");
  const { data: resCamel, error: errCamel } = await supabase
    .from('notifications')
    .insert(camelCasePayload)
    .select();

  if (errCamel) {
    console.error("camelCase insert failed:", errCamel);
  } else {
    console.log("camelCase insert SUCCEEDED:", resCamel);
  }

  // Let's try to insert a test notification using snake_case keys
  const snakeCasePayload = {
    id: globalThis.crypto.randomUUID(),
    member_id: member.id,
    message: 'Test snake_case notification',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log("Trying insert with snake_case payload...");
  const { data: resSnake, error: errSnake } = await supabase
    .from('notifications')
    .insert(snakeCasePayload)
    .select();

  if (errSnake) {
    console.error("snake_case insert failed:", errSnake);
  } else {
    console.log("snake_case insert SUCCEEDED:", resSnake);
  }
}

main();
