const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';

function createPost(channelId, text, imageUrl, scheduledAt) {
  return new Promise((resolve, reject) => {
    const mutation = `
      mutation {
        createPost(input: {
          text: ${JSON.stringify(text)},
          channelId: ${JSON.stringify(channelId)},
          mode: shareNow,
          schedulingType: automatic,
          metadata: { facebook: { type: post } }
          ${imageUrl ? `, media: { image: { url: ${JSON.stringify(imageUrl)} } }` : ''}
          ${scheduledAt ? `, scheduledAt: ${JSON.stringify(scheduledAt)}` : ''}
        }) {
          id
          createdAt
          scheduledAt
        }
      }
    `;
    const body = JSON.stringify({ query: mutation });
    const options = {
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': `Bearer ${API_KEY}` }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Schedule times (UTC)
// 12:00 PM MDT = 18:00 UTC
// 3:15 PM MDT = 21:15 UTC
const twelvePM = '2026-05-20T18:00:00Z';
const three15PM = '2026-05-20T21:15:00Z';

const channelTL = '6a0508eb090476fb991916ce';
const channelCC = '6a051053090476fb99192c00';

async function main() {
  console.log('Scheduling 12:00 PM posts...');

  // 12 PM - Tight Lines Engagement (NO image)
  const r1 = await createPost(channelTL,
    `🎣 Hook, Line & Thinker\n\nWhat's the one piece of fishing gear you never leave home without — and why?\n\nDrop your answer below 👇\n\nTight lines, KC`,
    null, twelvePM);
  console.log('TL 12pm:', JSON.stringify(r1));

  // 12 PM - Camp Cook Engagement (NO image)
  const r2 = await createPost(channelCC,
    `Dutch oven, propane stove, or open fire — what's your go-to for camp cooking and why?\n\nDrop your answer below 👇\n\nCamp Cook`,
    null, twelvePM);
  console.log('CC 12pm:', JSON.stringify(r2));

  console.log('Scheduling 3:15 PM posts...');

  // 3:15 PM - Tight Lines Weekly Gear (WITH image)
  const r3 = await createPost(channelTL,
    `🆕 What's Working This Week:\n\n• **Squarebill Crankbaits** — post-spawn bass are staging on secondary points and docks; a compact squarebill deflects cover perfectly and triggers reaction strikes\n• **Ned Rigs** — fish are still transitioning off beds; a ned rig on a 3/16oz jig head gets bites when they won't commit to anything heavier\n\n⚡ What lure is YOUR go-to right now? Drop it below 👇\n\nTight lines, KC`,
    'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=1200&fit=crop',
    three15PM);
  console.log('TL 3:15pm:', JSON.stringify(r3));

  // 3:15 PM - Camp Cook Weekly Recipe (WITH image)
  const r4 = await createPost(channelCC,
    `🔥 Camp Cook Tip:\n\n**Cast Iron Campfire Nachos**\n\nLayer chips, seasoned ground beef, black beans, jalapeños, and shredded cheese in a cast iron skillet. Place over coals for 10-12 minutes until cheese melts. Great for sharing at camp.\n\nGive it a shot and let us know how it turned out 👇\n\nCamp Cook`,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop',
    three15PM);
  console.log('CC 3:15pm:', JSON.stringify(r4));
}

main().catch(console.error);