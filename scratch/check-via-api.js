const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("Supabase client initialized!");

  // Try fetching notifications
  const { data: notifications, error: notifError } = await supabase
    .from('notifications')
    .select('*')
    .limit(1);

  if (notifError) {
    console.error("Error fetching notifications:", notifError);
  } else {
    console.log("Successfully fetched notifications! Sample:", notifications);
  }

  // Try fetching messages
  const { data: messages, error: msgError } = await supabase
    .from('messages')
    .select('*')
    .limit(1);

  if (msgError) {
    console.error("Error fetching messages:", msgError);
  } else {
    console.log("Successfully fetched messages! Sample:", messages);
  }

  // Try fetching events
  const { data: events, error: evtError } = await supabase
    .from('events')
    .select('*')
    .limit(1);

  if (evtError) {
    console.error("Error fetching events:", evtError);
  } else {
    console.log("Successfully fetched events! Sample:", events);
  }
}

main();
