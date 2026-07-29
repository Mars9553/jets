const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:/Users/hp/javspt/uno_one/server/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

async function checkUsers() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('User Record:', JSON.stringify(data, null, 2));
  }
}

checkUsers();
