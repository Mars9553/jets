/**
 * One-off script to update event image URLs in Supabase.
 *
 * Run from the e-board directory:
 *   node server/update-images.js
 *
 * This updates the image and gallery fields for every event
 * whose legacy_id matches the seed data.
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { getSupabase } = require('./db');
const { SEED_EVENTS } = require('./seedData');

async function main() {
  const supabase = getSupabase();

  console.log(`Updating images for ${SEED_EVENTS.length} events...\n`);

  let updated = 0;
  let failed = 0;

  for (const event of SEED_EVENTS) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ image: event.image, gallery: event.gallery })
        .eq('legacy_id', event.legacyId);

      if (error) {
        console.warn(`  ✗ Failed for "${event.title}" (${event.legacyId}): ${error.message}`);
        failed++;
      } else {
        console.log(`  ✓ Updated "${event.title}" (${event.legacyId})`);
        updated++;
      }
    } catch (err) {
      console.warn(`  ✗ Error for "${event.title}" (${event.legacyId}): ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
