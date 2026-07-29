const { getSupabase } = require('../db');

async function getCommentCounts(targetType, targetIds) {
  if (!targetIds.length) return {};

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('comments')
    .select('target_id')
    .eq('target_type', targetType)
    .in('target_id', targetIds);

  if (error) {
    console.error('getCommentCounts error:', error);
    return {};
  }

  const counts = {};
  for (const row of data) {
    counts[row.target_id] = (counts[row.target_id] || 0) + 1;
  }
  return counts;
}

async function getLikeCounts(targetType, targetIds) {
  if (!targetIds.length) return {};

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('likes')
    .select('target_id')
    .eq('target_type', targetType)
    .in('target_id', targetIds);

  if (error) {
    console.error('getLikeCounts error:', error);
    return {};
  }

  const counts = {};
  for (const row of data) {
    counts[row.target_id] = (counts[row.target_id] || 0) + 1;
  }
  return counts;
}

async function getUserLikes(targetType, targetIds, userId) {
  if (!userId || !targetIds.length) return new Set();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('likes')
    .select('target_id')
    .eq('target_type', targetType)
    .in('target_id', targetIds)
    .eq('user_id', userId);

  if (error) {
    console.error('getUserLikes error:', error);
    return new Set();
  }

  return new Set(data.map((row) => row.target_id));
}

async function attachEngagementCounts(targetType, items, userId) {
  const ids = items.map((item) => item.legacy_id ?? item.legacyId);
  const [commentCounts, likeCounts, likedSet] = await Promise.all([
    getCommentCounts(targetType, ids),
    getLikeCounts(targetType, ids),
    getUserLikes(targetType, ids, userId),
  ]);

  return items.map((item) => {
    const key = item.legacy_id ?? item.legacyId;
    return {
      ...item,
      comments: commentCounts[key] ?? 0,
      likes: likeCounts[key] ?? 0,
      liked: likedSet.has(key),
    };
  });
}

function initialsFromName(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

module.exports = { attachEngagementCounts, initialsFromName };
