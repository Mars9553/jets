const express = require('express');
const { getSupabase } = require('../db');
const { attachEngagementCounts, initialsFromName } = require('../utils/engagement');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const supabase = getSupabase();

    const { data: notices, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const withCounts = await attachEngagementCounts('notice', notices, userId);
    res.json(withCounts.map(formatNotice));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const supabase = getSupabase();

    const { data: notice, error } = await supabase
      .from('notices')
      .select('*')
      .eq('legacy_id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    const [withCounts] = await attachEngagementCounts('notice', [notice], userId);
    res.json(formatNotice(withCounts));
  } catch (err) {
    next(err);
  }
});

function formatNotice(doc) {
  return {
    id: doc.legacy_id,
    category: doc.category,
    title: doc.title,
    description: doc.description,
    date: doc.date,
    createdAt: doc.created_at,
    comments: doc.comments ?? 0,
    likes: doc.likes ?? 0,
    liked: doc.liked ?? false,
    // Supabase Storage attachment URLs (null if not set)
    fileUrl: doc.file_url ?? null,
    pdfUrl: doc.pdf_url ?? null,
    imageUrl: doc.image_url ?? null,
  };
}

module.exports = router;
