const express = require('express');
const { getSupabase } = require('../db');
const { attachEngagementCounts, initialsFromName } = require('../utils/engagement');

const router = express.Router();

// GET comments for a target
router.get('/comments/:targetType/:targetId', async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;
    if (!['notice', 'event'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid target type' });
    }

    const supabase = getSupabase();
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(
      comments.map((c) => ({
        id: c.id.toString(),
        author: c.author_name,
        initials: c.author_initials,
        content: c.text,
        date: formatRelativeTime(c.created_at),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// POST a new comment
router.post('/comments', async (req, res, next) => {
  try {
    const { targetType, targetId, userId, authorName, text } = req.body;

    if (!['notice', 'event'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid target type' });
    }
    if (!targetId || !userId || !authorName || !text?.trim()) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const supabase = getSupabase();
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        target_type: targetType,
        target_id: targetId,
        user_id: userId,
        author_name: authorName.trim(),
        author_initials: initialsFromName(authorName),
        text: text.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      id: comment.id.toString(),
      author: comment.author_name,
      initials: comment.author_initials,
      content: comment.text,
      date: 'Just now',
      userId: comment.user_id,
    });
  } catch (err) {
    next(err);
  }
});

// POST toggle a like
router.post('/likes/toggle', async (req, res, next) => {
  try {
    const { targetType, targetId, userId } = req.body;

    if (!['notice', 'event'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid target type' });
    }
    if (!targetId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const supabase = getSupabase();

    // Check if like already exists
    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) {
      await supabase.from('likes').delete().eq('id', existing.id);
    } else {
      await supabase.from('likes').insert({
        target_type: targetType,
        target_id: targetId,
        user_id: userId,
      });
    }

    // Get updated count
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('target_type', targetType)
      .eq('target_id', targetId);

    res.json({ liked: !existing, likes: count ?? 0 });
  } catch (err) {
    next(err);
  }
});

// GET engagement stats for a target
router.get('/stats/:targetType/:targetId', async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;
    const userId = req.query.userId;

    const [item] = await attachEngagementCounts(
      targetType,
      [{ legacy_id: targetId }],
      userId
    );

    res.json({
      comments: item?.comments ?? 0,
      likes: item?.likes ?? 0,
      liked: item?.liked ?? false,
    });
  } catch (err) {
    next(err);
  }
});

function formatRelativeTime(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

module.exports = router;
