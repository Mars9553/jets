const webpush = require('web-push');
const { getSupabase } = require('../db');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@rsu.edu.ng',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushToSubscription(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      const url = subscription?.endpoint;
      if (url) {
        await getSupabase()
          .from('push_subscriptions')
          .delete()
          .eq('endpoint', url);
      }
    }
    return false;
  }
}

async function sendPushToUser(userId, payload) {
  const supabase = getSupabase();
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);

  if (error || !subs || subs.length === 0) return 0;

  let sent = 0;
  for (const row of subs) {
    const ok = await sendPushToSubscription(
      {
        endpoint: row.endpoint,
        keys: row.keys,
      },
      payload
    );
    if (ok) sent++;
  }
  return sent;
}

async function broadcastPush(payload, limit = 500) {
  const supabase = getSupabase();
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .limit(limit);

  if (error || !subs || subs.length === 0) return 0;

  let sent = 0;
  for (const row of subs) {
    const ok = await sendPushToSubscription(
      {
        endpoint: row.endpoint,
        keys: row.keys,
      },
      payload
    );
    if (ok) sent++;
  }
  return sent;
}

module.exports = {
  sendPushToUser,
  broadcastPush,
  sendPushToSubscription,
};
