/**
 * Creates all required tables in Supabase using the SQL endpoint.
 * Run: node server/create_tables.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const STATEMENTS = [
  // Users
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    mat_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    level TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    initials TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  // Notices
   `CREATE TABLE IF NOT EXISTS notices (
     id SERIAL PRIMARY KEY,
     legacy_id TEXT UNIQUE NOT NULL,
     category TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT NOT NULL,
     summary TEXT,
     date TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   )`,

  // Events
  `CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    legacy_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    date TEXT NOT NULL,
    time TEXT,
    venue TEXT,
    status TEXT DEFAULT 'upcoming',
    category TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    organizer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Comments
  `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_initials TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,

  // Comments index
  `CREATE INDEX IF NOT EXISTS idx_comments_target
    ON comments (target_type, target_id, created_at DESC)`,

  // Likes
  `CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (target_type, target_id, user_id)
  )`,
];

// RLS policies: allow service_role full access
const RLS_TABLES = ['users', 'notices', 'events', 'comments', 'likes'];

async function createTables() {
  // Supabase exposes a pg REST query endpoint at /pg/query for the secret key
  // But since that's not available, we'll try each DDL statement via the
  // Supabase Management SQL endpoint.

  // Actually, PostgREST doesn't support DDL. We need to use the Supabase
  // SQL API which is available at the project's database connection.
  // The simplest approach: use the `@supabase/supabase-js` client to attempt
  // an insert to each table. If the table doesn't exist, the error message
  // will tell us.

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

  // Check each table
  for (const table of RLS_TABLES) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Table "${table}" is NOT accessible: ${error.message}`);
      console.error('');
      console.error('=== YOU NEED TO CREATE TABLES MANUALLY ===');
      console.error('1. Go to https://supabase.com/dashboard');
      console.error('2. Open your project');
      console.error('3. Go to SQL Editor');
      console.error('4. Copy and paste the contents of server/setup_tables.sql');
      console.error('5. Click "Run"');
      console.error('6. Then restart the server with: npm run server');
      process.exit(1);
    } else {
      console.log(`✓ Table "${table}" is accessible`);
    }
  }

  console.log('\nAll tables are ready!');
}

createTables().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
