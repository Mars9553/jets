const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:/Users/hp/javspt/uno_one/server/.env' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function fixPassword() {
  const newHash = await bcrypt.hash('password123', 10);
  const { data, error } = await supabase
    .from('users')
    .update({ password_hash: newHash })
    .eq('mat_number', 'DE.2021/5628')
    .select();

  if (error) {
    console.error('Update error:', error);
  } else {
    console.log('Successfully updated password for Udoh Bright to password123:', data);
  }
}

fixPassword();
