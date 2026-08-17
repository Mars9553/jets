require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { broadcastPush } = require('./utils/push');

async function main() {
  const payload = {
    title: 'Global South Index Buildathon 2026',
    body: 'Join the buildathon happening on Aug 22, 2026 at Manor House. Build data tools, dashboards, and policy prototypes for Global South development challenges.',
    data: {
      type: 'event',
      id: '4',
      url: '/event/4',
    },
  };

  const sent = await broadcastPush(payload, 500);
  console.log(`Broadcast complete. Sent to ${sent} subscription(s).`);
}

main().catch((err) => {
  console.error('Broadcast failed:', err.message);
  process.exit(1);
});
