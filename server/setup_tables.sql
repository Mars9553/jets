-- Run this in Supabase Dashboard > SQL Editor
-- This creates all tables needed for the bulletin board app.

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  mat_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  level TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  initials TEXT NOT NULL,
  faculty TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id SERIAL PRIMARY KEY,
  legacy_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
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
  gallery JSONB DEFAULT '[]',
  highlights JSONB DEFAULT '[]',
  organizer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_initials TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_target
  ON comments (target_type, target_id, created_at DESC);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (target_type, target_id, user_id)
);

-- Disable RLS for all tables so the server (using secret key) can access them.
-- If you want to enable RLS later, add appropriate policies.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow service_role (secret key) full access
DROP POLICY IF EXISTS "service_role_all_users" ON users;
CREATE POLICY "service_role_all_users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_notices" ON notices;
CREATE POLICY "service_role_all_notices" ON notices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_events" ON events;
CREATE POLICY "service_role_all_events" ON events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_comments" ON comments;
CREATE POLICY "service_role_all_comments" ON comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_likes" ON likes;
CREATE POLICY "service_role_all_likes" ON likes FOR ALL USING (true) WITH CHECK (true);

