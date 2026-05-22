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
  console.log('Scheduling remaining posts...\n');

  // TL What's Working - 3 PM MDT with working trout image
  await schedule(
    "TL What's Working",
    tightLines,
    "🆕 What's Working This Week:\n\nPost-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.\n\nMeanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.\n\n⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇\n\nTight lines, KC [id:tl-w8]",
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // CC Engagement - 12 PM MDT - try different text format
  await schedule(
    "CC Engagement",
    campCook,
    "Coffee at camp — what's your method?\n\nFrench press? Cowboy method? Something else entirely?\n\nDrop your answer below 👇\n\nCamp Cook [id:cc-e2]",
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // CC Daily Recipe - 3 PM MDT
  await schedule(
    "CC Daily Recipe",
    campCook,
    "🔥 Camp Cook Tip:\n\nDutch Oven Campfire Beans\n\nForget opening a can — throw dried navy beans, salt pork, molasses, and mustard into your Dutch oven before heading out. Let that fire do the work while you're set up at camp. By dinner, you've got a rich, smoky side that goes with anything off the grill.\n\nKey rig: Dutch oven, charcoal, dried navy beans, salt pork, molasses, yellow mustard\n\nGive it a shot and let us know how it turned out 👇\n\nCamp Cook [id:cc-r2]",
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // CC Evening Hack - 6 PM MDT
  await schedule(
    "CC Evening Hack",
    campCook,
    "🔧 CAMP KITCHEN HACK 🔧\n\nNever wash your cast iron skillet at camp.\n\n❌ No soap ❌ No scrubbing ❌ No soaking\n\n✅ Wipe warm with paper towel\n✅ Stuck on? Water + simmer + scrape\n✅ Re-oil and store\n\nSoap strips the seasoning. Soaking causes rust. Take care of your gear and it'll feed you for decades.\n\nCamp Cook [id:cc-h2]",
    'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=1200&fit=crop',
    '2026-05-22T00:00:00.000Z'
  );

  console.log('\nDone!');
}

main().catch(console.error);