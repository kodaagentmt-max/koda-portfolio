const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const campCook = '6a051053090476fb99192c00';
const tightLines = '6a0508eb090476fb991916ce';

const query = "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename } }";

async function schedule(name, channelId, text, imageUrl, dueAt) {
  const input = {
    text,
    channelId,
    dueAt,
    schedulingType: "automatic",
    mode: "customScheduled",
    metadata: { facebook: { type: "post" } },
    assets: imageUrl ? [{ image: { url: imageUrl } }] : []
  };
  const body = JSON.stringify({ query, variables: { input } });
  
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        const type = parsed.data?.createPost?.__typename;
        const due = new Date(dueAt).toLocaleString('en-US', { timeZone: 'America/Denver' });
        const err = parsed.errors?.[0]?.message;
        console.log(`${type === 'PostActionSuccess' ? '✅' : '❌'} ${due} | ${name}: ${type}${err ? ' - ' + err : ''}`);
        resolve(type);
      });
    });
    req.on('error', e => { console.log('❌ Network:', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Scheduling remaining posts for today...\n');

  // TL What's Working This Week - 3 PM MDT (21:00 UTC)
  await schedule(
    "TL What's Working",
    tightLines,
    "🆕 What's Working This Week:\n\nPost-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.\n\nMeanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.\n\n⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇\n\nTight lines, KC [id:tl-wk1]",
    'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // TL Hook Line & Thinker - 6 PM MDT (00:00 UTC May 22)
  await schedule(
    "TL Hook Line & Thinker",
    tightLines,
    "🧠 HOOK, LINE & THINKER 🧠\n\nWhen a bass is feeding actively in the summer heat, what's the ONE water depth zone you should almost ALWAYS find them in?\n\nThink temperature, oxygen, and forage — that's your combo.\n\nAnswer in the comments 👇\n\nTight lines, KC [id:tl-hlt2]",
    null,
    '2026-05-22T00:00:00.000Z'
  );

  // CC Midday Engagement - 12 PM MDT (18:00 UTC)
  await schedule(
    "CC Midday Engagement",
    campCook,
    "Hey Camp Cook community — quick question:\n\nWhat's your go-to method for making coffee while you're out in the field?\n\nFrench press? Cowboy method? Something else entirely?\n\nWe want to know what works for YOU. Drop it below 👇\n\nCamp Cook [id:cc-e1]",
    null,
    '2026-05-21T18:00:00.000Z'
  );

  console.log('\nDone!');
}

main().catch(console.error);