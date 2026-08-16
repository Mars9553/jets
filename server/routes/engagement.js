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

    const { data: topLevel, error: topError } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (topError) throw topError;

    if (!topLevel || topLevel.length === 0) {
      return res.json([]);
    }

    const topIds = topLevel.map((c) => c.id);

    const { data: replies, error: repliesError } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .in('parent_comment_id', topIds)
      .order('created_at', { ascending: true });

    if (repliesError) throw repliesError;

    const repliesByParent = {};
    for (const reply of replies || []) {
      const parentId = reply.parent_comment_id;
      if (!repliesByParent[parentId]) {
        repliesByParent[parentId] = [];
      }
      repliesByParent[parentId].push(reply);
    }

    res.json(
      topLevel.map((c) => ({
        id: c.id.toString(),
        author: c.author_name,
        initials: c.author_initials,
        content: c.text,
        date: formatRelativeTime(c.created_at),
        userId: c.user_id,
        replies: (repliesByParent[c.id] || []).map((r) => ({
          id: r.id.toString(),
          author: r.author_name,
          initials: r.author_initials,
          content: r.text,
          date: formatRelativeTime(r.created_at),
          userId: r.user_id,
        })),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// POST a new comment
router.post('/comments', async (req, res, next) => {
  try {
    const { targetType, targetId, userId, authorName, text, parentCommentId } = req.body;

    if (!['notice', 'event'].includes(targetType)) {
      return res.status(400).json({ error: 'Invalid target type' });
    }
    if (!targetId || !userId || !authorName || !text?.trim()) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const supabase = getSupabase();
    const insertPayload = {
      target_type: targetType,
      target_id: targetId,
      user_id: userId,
      author_name: authorName.trim(),
      author_initials: initialsFromName(authorName),
      text: text.trim(),
    };

    if (parentCommentId) {
      insertPayload.parent_comment_id = parseInt(parentCommentId, 10);
    }

    const { data: comment, error } = await supabase
      .from('comments')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;

    const response = {
      id: comment.id.toString(),
      author: comment.author_name,
      initials: comment.author_initials,
      content: comment.text,
      date: 'Just now',
      userId: comment.user_id,
    };

    if (comment.parent_comment_id) {
      response.parentCommentId = comment.parent_comment_id.toString();
    }

    res.status(201).json(response);
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
