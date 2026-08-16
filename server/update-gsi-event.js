require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { getSupabase } = require('./db');
const { SEED_EVENTS } = require('./seedData');

async function main() {
  const supabase = getSupabase();
  const event = SEED_EVENTS.find(e => e.legacyId === '4');

  if (!event) {
    console.error('Event with legacy_id 4 not found in seed data');
    process.exit(1);
  }

  console.log('Updating event:', event.title);
  console.log('Venue:', event.venue);

  const { data, error } = await supabase
    .from('events')
    .update({
      title: event.title,
      description: event.description,
      short_description: event.shortDescription,
      date: event.date,
      time: event.time,
      venue: event.venue,
      status: event.status,
      category: event.category,
      image: event.image,
      gallery: event.gallery,
      highlights: event.highlights,
      organizer: event.organizer,
    })
    .eq('legacy_id', '4')
    .select('legacy_id, title, venue');

  if (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }

  console.log('Updated event in Supabase:', JSON.stringify(data, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
