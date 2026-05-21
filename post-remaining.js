const https = require('https');
const API_KEY = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';

const channelTL = '6a0508eb090476fb991916ce';
const channelCC = '6a051053090476fb99192c00';

function gql(query, variables) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(JSON.stringify({ query, variables }));
    const opts = {
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': body.length, 'Authorization': 'Bearer ' + API_KEY }
    };
    const req = https.request(opts, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d)); });
    req.on('error', reject); req.write(body); req.end();
  });
}

async function post(channelId, text, imageUrl, dueAt) {
  const result = await gql(`
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess { post { id createdAt } }
      }
    }
  `, {
    input: {
      text,
      channelId,
      mode: 'customScheduled',
      schedulingType: 'automatic',
      dueAt,
      assets: imageUrl ? [{ image: { url: imageUrl } }] : [],
      metadata: { facebook: { type: 'post' } }
    }
  });
  return result;
}

async function main() {
  const posts = [
    // 12 PM MDT (18:00 UTC) - Tight Lines Engagement (no image)
    { ch: channelTL, text: `🎣 Hook, Line & Thinker\n\nWhat's the one piece of fishing gear you never leave home without — and why?\n\nDrop your answer below 👇\n\nTight lines, KC`, img: null, due: '2026-05-20T18:00:00Z', label: 'TL 12pm Engagement' },
    // 12 PM MDT - Camp Cook Engagement (no image)
    { ch: channelCC, text: `Dutch oven, propane stove, or open fire — what's your go-to for camp cooking and why?\n\nDrop your answer below 👇\n\nCamp Cook`, img: null, due: '2026-05-20T18:00:00Z', label: 'CC 12pm Engagement' },
    // 3:15 PM MDT (21:15 UTC) - Tight Lines Weekly Gear (with image)
    { ch: channelTL, text: `🆕 What's Working This Week:\n\n• **Squarebill Crankbaits** — post-spawn bass are staging on secondary points and docks; a compact squarebill deflects cover perfectly and triggers reaction strikes\n• **Ned Rigs** — fish are still transitioning off beds; a ned rig on a 3/16oz jig head gets bites when they won't commit to anything heavier\n\n⚡ What lure is YOUR go-to right now? Drop it below 👇\n\nTight lines, KC`, img: 'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=1200&fit=crop', due: '2026-05-20T21:15:00Z', label: 'TL 3:15pm Gear' },
    // 3:15 PM MDT - Camp Cook Weekly Recipe (with image)
    { ch: channelCC, text: `🔥 Camp Cook Tip:\n\n**Cast Iron Campfire Nachos**\n\nLayer chips, seasoned ground beef, black beans, jalapeños, and shredded cheese in a cast iron skillet. Place over coals for 10-12 minutes until cheese melts. Great for sharing at camp.\n\nGive it a shot and let us know how it turned out 👇\n\nCamp Cook`, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop', due: '2026-05-20T21:15:00Z', label: 'CC 3:15pm Recipe' },
    // 6 PM MDT (00:00 UTC May 21) - Tight Lines Hook Line & Thinker (with image)
    { ch: channelTL, text: `🎣 Hook, Line & Thinker\n\nCan bass actually see color underwater, or do they rely mostly on motion and silhouette? What's your experience?\n\nDrop your answer below 👇\n\nTight lines, KC`, img: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&fit=crop', due: '2026-05-21T00:00:00Z', label: 'TL 6pm Trivia' },
    // 6 PM MDT - Camp Cook Camp Hack (with image)
    { ch: channelCC, text: `🏕️ Camp Kitchen Hack:\n\nSave your old coffee can — punch holes in the lid and you've got a free shaker for seasoning, flour, or bait corn on the go. Takes 2 minutes and works better than buying a specialty container.\n\nGive it a shot and let us know how it went 👇\n\nCamp Cook`, img: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&fit=crop', due: '2026-05-21T00:00:00Z', label: 'CC 6pm Hack' }
  ];

  for (const p of posts) {
    console.log(`Scheduling ${p.label} (due ${p.due})...`);
    const r = await post(p.ch, p.text, p.img, p.due);
    console.log(`Result: ${r}`);
  }
}

main().catch(console.error);