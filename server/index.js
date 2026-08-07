require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const path = require('path');
const { connectDb, getSupabase } = require('./db');
const { SEED_NOTICES, SEED_EVENTS } = require('./seedData');

const noticesRouter = require('./routes/notices');
const eventsRouter = require('./routes/events');
const engagementRouter = require('./routes/engagement');
const usersRouter = require('./routes/users');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/notices', noticesRouter);
app.use('/api/events', eventsRouter);
app.use('/api', engagementRouter);
app.use('/api/users', usersRouter);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use('/sw.js', (_req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Type', 'application/javascript');
  next();
});

app.use('/manifest.json', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Content-Type', 'application/json');
  next();
});

const webBuildPath = path.join(__dirname, '..', 'dist');
app.use(express.static(webBuildPath, { fallthrough: true }));

app.use((req, res) => {
  res.sendFile(path.join(webBuildPath, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function autoSeed() {
  const supabase = getSupabase();

  // Check if notices table has data
  const { data: existingNotices, error } = await supabase
    .from('notices')
    .select('id')
    .limit(1);

  if (error) {
    console.warn('Could not check notices table for seeding:', error.message);
    console.warn('You may need to create the tables first. See setup_tables.sql');
    return;
  }

  if (!existingNotices || existingNotices.length === 0) {
    const now = new Date().toISOString();

    // Seed notices
    const noticeRows = SEED_NOTICES.map((n) => ({
      legacy_id: n.legacyId,
      category: n.category,
      title: n.title,
      description: n.description,
      summary: n.summary,
      date: n.date,
      created_at: now,
      updated_at: now,
    }));

    const { error: nErr } = await supabase.from('notices').insert(noticeRows);
    if (nErr) console.warn('Seed notices error:', nErr.message);

    // Seed events
    const eventRows = SEED_EVENTS.map((e) => ({
      legacy_id: e.legacyId,
      title: e.title,
      description: e.description,
      short_description: e.shortDescription,
      date: e.date,
      time: e.time,
      venue: e.venue,
      status: e.status,
      category: e.category,
      image: e.image,
      gallery: e.gallery,
      highlights: e.highlights,
      organizer: e.organizer,
      created_at: now,
      updated_at: now,
    }));

    const { error: eErr } = await supabase.from('events').insert(eventRows);
    if (eErr) console.warn('Seed events error:', eErr.message);

    if (!nErr && !eErr) {
      console.log('Auto-seeded database with initial notices and events.');
    }
  } else {
    console.log('Database already has notices, skipping seed.');
    await updateEventImages();
  }
}

async function updateEventImages() {
  const supabase = getSupabase();

  for (const event of SEED_EVENTS) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ image: event.image, gallery: event.gallery })
        .eq('legacy_id', event.legacyId);

      if (error) {
        console.warn(`Failed to update images for event ${event.legacyId}:`, error.message);
      } else {
        console.log(`Updated images for event "${event.title}" (legacy_id: ${event.legacyId})`);
      }
    } catch (err) {
      console.warn(`Error updating event ${event.legacyId}:`, err.message);
    }
  }

  console.log('Event image update complete.');
}

async function start() {
  await connectDb();
  await autoSeed();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  start().catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
}

module.exports = app;
