require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { getSupabase } = require('./db');

async function main() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id, user_id, endpoint, user_agent, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch subscriptions:', error.message);
    process.exit(1);
  }

  console.log(`Total subscriptions: ${data?.length ?? 0}`);
  if (data?.length) {
    for (const row of data) {
      console.log('---');
      console.log('id:', row.id);
      console.log('user_id:', row.user_id ?? '<anonymous>');
      console.log('endpoint:', row.endpoint);
      console.log('user_agent:', row.user_agent ?? '<none>');
      console.log('created_at:', row.created_at);
    }
  }
}

main().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
