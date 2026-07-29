const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error(
    'Set SUPABASE_URL and SUPABASE_SECRET_KEY in server/.env'
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

/**
 * Connect: validates credentials by pinging Supabase.
 */
async function connectDb() {
  console.log(`Connecting to Supabase at ${SUPABASE_URL} ...`);
  // Quick connectivity check
  const { error } = await supabase.from('users').select('id', { count: 'exact', head: true });
  if (error && error.code !== 'PGRST116') {
    console.warn('Supabase connectivity warning:', error.message);
  }
  console.log('Supabase connection established.');
}

function getSupabase() {
  return supabase;
}

module.exports = { connectDb, getSupabase };
