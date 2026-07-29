const { connectDb, getDb, closeDb } = require('./db');
const { SEED_NOTICES, SEED_EVENTS } = require('./seedData');

async function seed() {
  await connectDb();
  const db = getDb();

  for (const notice of SEED_NOTICES) {
    await db.collection('notices').updateOne(
      { legacyId: notice.legacyId },
      { $set: { ...notice, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  for (const event of SEED_EVENTS) {
    await db.collection('events').updateOne(
      { legacyId: event.legacyId },
      { $set: { ...event, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  console.log(`Seeded ${SEED_NOTICES.length} notices and ${SEED_EVENTS.length} events.`);
  await closeDb();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
