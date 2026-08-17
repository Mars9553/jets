const express = require('express');
const { getSupabase } = require('../db');

const router = express.Router();

router.get('/vapid-public-key', (_req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

router.post('/subscribe', async (req, res, next) => {
  try {
    const { userId, subscription, userAgent } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ error: 'Invalid subscription payload' });
    }

    const supabase = getSupabase();

    const { data: existing, error: selectError } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscription.endpoint)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error: updateError } = await supabase
        .from('push_subscriptions')
        .update({
          user_id: userId || null,
          keys: subscription.keys,
          user_agent: userAgent || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) throw updateError;
      return res.status(200).json({ ok: true, updated: true });
    }

    const { error: insertError } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id: userId || null,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        user_agent: userAgent || null,
      });

    if (insertError) throw insertError;

    res.status(201).json({ ok: true, updated: false });
  } catch (err) {
    next(err);
  }
});

router.post('/unsubscribe', async (req, res, next) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ error: 'Missing endpoint' });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) throw error;

    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
