const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

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
  console.log('Scheduling posts for today...\n');

  // === TIGHT LINES ===
  // 1. Midday Engagement - 12 PM MDT (18:00 UTC)
  await schedule(
    "TL Engagement",
    tightLines,
    "Alright, anglers — real talk.\n\nWhat's the ONE piece of fishing gear you never leave home without?\n\nNot the rod. Not the reel. I'm talking the small stuff. The thing that saves the day when everything else goes sideways.\n\nDrop it in the comments 👇\n\nTight lines, KC [id:tl-e1]",
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // 2. What's Working - 3 PM MDT (21:00 UTC)
  // Use mountain-lake-reflection which worked earlier
  await schedule(
    "TL What's Working",
    tightLines,
    "🆕 What's Working This Week:\n\nPost-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.\n\nMeanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.\n\n⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇\n\nTight lines, KC [id:tl-w1]",
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // 3. Hook Line & Thinker - 6 PM MDT (00:00 UTC May 22)
  await schedule(
    "TL Hook Line",
    tightLines,
    "🧠 HOOK, LINE & THINKER 🧠\n\nWhen a bass is feeding actively in the summer heat, what's the ONE water depth zone you should almost ALWAYS find them in?\n\nThink temperature, oxygen, and forage — that's your combo.\n\nAnswer in the comments 👇\n\nTight lines, KC [id:tl-h1]",
    null,
    '2026-05-22T00:00:00.000Z'
  );

  // === CAMP COOK ===
  // 4. Midday Engagement - 12 PM MDT
  await schedule(
    "CC Engagement",
    campCook,
    "Hey Camp Cook community — quick question:\n\nWhat's your go-to method for making coffee while you're out in the field?\n\nFrench press? Cowboy method? Something else entirely?\n\nWe want to know what works for YOU. Drop it below 👇\n\nCamp Cook [id:cc-e1]",
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // 5. Daily Recipe/Tip - 3 PM MDT
  await schedule(
    "CC Daily Recipe",
    campCook,
    "🔥 Camp Cook Tip:\n\nDutch Oven Campfire Beans\n\nForget opening a can — throw dried navy beans, salt pork, molasses, and mustard into your Dutch oven before heading out. Let that fire do the work while you're set up at camp. By dinner, you've got a rich, smoky side that goes with anything off the grill.\n\nKey rig: Dutch oven, charcoal, dried navy beans, salt pork, molasses, yellow mustard\n\nGive it a shot and let us know how it turned out 👇\n\nCamp Cook [id:cc-r1]",
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // 6. Camp Kitchen Hack - 6 PM MDT
  await schedule(
    "CC Evening Hack",
    campCook,
    "🔧 CAMP KITCHEN HACK 🔧\n\nHere's a truth that catches a lot of people off-guard in the field:\n\nYou should NEVER wash your cast iron skillet at camp.\n\n❌ No soap\n❌ No scrubbing\n❌ No soaking\n\nInstead:\n✅ Wipe it out while still warm with a paper towel or natural fiber cloth\n✅ If there's stuck-on bits, pour in a bit of water, bring to a simmer, then scrape clean\n✅ Re-oil with a thin layer of camp-approved oil (olive, vegetable, or bacon fat)\n✅ Wipe dry and store\n\nSoap strips the seasoning. Soaking causes rust. And rust on a good skillet is just... sad.\n\nTake care of your gear and it'll feed you for decades.\n\nCamp Cook [id:cc-h1]",
    'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=1200&fit=crop',
    '2026-05-22T00:00:00.000Z'
  );

  console.log('\nDone!');
}

main().catch(console.error);