const express = require('express');
const { getSupabase } = require('../db');
const { attachEngagementCounts } = require('../utils/engagement');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const supabase = getSupabase();

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const withCounts = await attachEngagementCounts('event', events, userId);
    res.json(withCounts.map(formatEvent));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const supabase = getSupabase();

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('legacy_id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const [withCounts] = await attachEngagementCounts('event', [event], userId);
    res.json(formatEvent(withCounts));
  } catch (err) {
    next(err);
  }
});

/**
 * Computes the real-time event status from the date string.
 * The stored `status` column is ignored — it gets stale as time passes.
 *
 * Supports:
 *  - "Jan 8, 2026"
 *  - "Jun 15 - Jun 20, 2026"
 *  - "Jun 15, 2026 - Jun 20, 2026"
 */
function computeStatus(dateStr) {
  if (!dateStr) return 'upcoming';

  const cleaned = dateStr.split('-')[0].trim();
  const eventDate = new Date(cleaned);
  if (isNaN(eventDate.getTime())) return 'upcoming';

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventMidnight = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  if (eventMidnight < todayMidnight) return 'past';
  if (eventMidnight.getTime() === todayMidnight.getTime()) return 'ongoing';
  return 'upcoming';
}

function formatEvent(doc) {
  return {
    id: doc.legacy_id,
    title: doc.title,
    description: doc.description,
    shortDescription: doc.short_description,
    date: doc.date,
    time: doc.time,
    venue: doc.venue,
    status: computeStatus(doc.date),   // Always computed fresh, never stale
    category: doc.category,
    image: doc.image,
    gallery: doc.gallery ?? [],
    highlights: doc.highlights ?? [],
    organizer: doc.organizer,
    comments: doc.comments ?? 0,
    likes: doc.likes ?? 0,
    liked: doc.liked ?? false,
    attending: doc.attending ?? 0,
    userAttending: doc.user_attending ?? false,
  };
}


module.exports = router;
