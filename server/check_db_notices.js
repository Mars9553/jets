const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:/Users/hp/javspt/uno_one/server/.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function checkNotices() {
  const { data, error } = await supabase.from('notices').select('*');
  if (error) {
    console.error('Error fetching notices:', error);
  } else {
    console.log('Notices in DB:', JSON.stringify(data.slice(0, 2), null, 2));
  }
}

checkNotices();
