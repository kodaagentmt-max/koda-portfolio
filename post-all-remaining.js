const https = require('https');
const API_KEY = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';

const channelTL = '6a0508eb090476fb991916ce';
const channelCC = '6a051053090476fb99192c00';

function post(channelId, text, imageUrl, scheduledAt) {
  return new Promise((resolve, reject) => {
    const mutation = `mutation {
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
    }`;
    const body = Buffer.from(JSON.stringify({ query: mutation }));
    const options = {
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': body.length, 'Authorization': 'Bearer ' + API_KEY }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve(data); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// MDT = UTC-6
// 12:00 PM MDT May 20 = 18:00 UTC May 20 = 2026-05-20T18:00:00Z
// 3:15 PM MDT May 20 = 21:15 UTC May 20 = 2026-05-20T21:15:00Z
// 6:00 PM MDT May 20 = 00:00 UTC May 21 = 2026-05-21T00:00:00Z
const twelvePM = '2026-05-20T18:00:00Z';
const three15PM = '2026-05-20T21:15:00Z';
const sixPM_MDT = '2026-05-21T00:00:00Z';

// Images
const imgTL_Gear = 'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=1200&fit=crop'; // fishing waders river
const imgTL_HLT = 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&fit=crop'; // crappie fish
const imgCC_Recipe = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop'; // dutch oven
const imgCC_Hack = 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200&fit=crop'; // campfire cooking pot

async function main() {
  console.log('Scheduling 12:00 PM MDT posts...');
  const r1 = await post(channelTL,
    `🎣 Hook, Line & Thinker\n\nWhat's the one piece of fishing gear you never leave home without — and why?\n\nDrop your answer below 👇\n\nTight lines, KC`,
    null, twelvePM);
  console.log('TL 12pm:', JSON.stringify(r1));

  const r2 = await post(channelCC,
    `Dutch oven, propane stove, or open fire — what's your go-to for camp cooking and why?\n\nDrop your answer below 👇\n\nCamp Cook`,
    null, twelvePM);
  console.log('CC 12pm:', JSON.stringify(r2));

  console.log('\nScheduling 3:15 PM MDT posts...');
  const r3 = await post(channelTL,
    `🆕 What's Working This Week:\n\n• **Squarebill Crankbaits** — post-spawn bass are staging on secondary points and docks; a compact squarebill deflects cover perfectly and triggers reaction strikes\n• **Ned Rigs** — fish are still transitioning off beds; a ned rig on a 3/16oz jig head gets bites when they won't commit to anything heavier\n\n⚡ What lure is YOUR go-to right now? Drop it below 👇\n\nTight lines, KC`,
    imgTL_Gear, three15PM);
  console.log('TL 3:15pm:', JSON.stringify(r3));

  const r4 = await post(channelCC,
    `🔥 Camp Cook Tip:\n\n**Cast Iron Campfire Nachos**\n\nLayer chips, seasoned ground beef, black beans, jalapeños, and shredded cheese in a cast iron skillet. Place over coals for 10-12 minutes until cheese melts. Great for sharing at camp.\n\nGive it a shot and let us know how it turned out 👇\n\nCamp Cook`,
    imgCC_Recipe, three15PM);
  console.log('CC 3:15pm:', JSON.stringify(r4));

  console.log('\nScheduling 6:00 PM MDT posts...');
  const r5 = await post(channelTL,
    `🎣 Hook, Line & Thinker\n\nCan bass actually see color underwater, or do they rely mostly on motion and silhouette? What's your experience?\n\nDrop your answer below 👇\n\nTight lines, KC`,
    imgTL_HLT, sixPM_MDT);
  console.log('TL 6pm:', JSON.stringify(r5));

  const r6 = await post(channelCC,
    `🏕️ Camp Kitchen Hack:\n\nSave your old coffee can — punch holes in the lid and you've got a free shaker for seasoning, flour, or bait corn on the go. Takes 2 minutes and works better than buying a specialty container.\n\nGive it a shot and let us know how it went 👇\n\nCamp Cook`,
    imgCC_Hack, sixPM_MDT);
  console.log('CC 6pm:', JSON.stringify(r6));
}

main().catch(console.error);