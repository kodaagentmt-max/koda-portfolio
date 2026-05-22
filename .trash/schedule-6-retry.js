const https = require('https');

const TOKEN = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const campCook = '6a051053090476fb99192c00';
const tightLines = '6a0508eb090476fb991916ce';

const query = "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename } }";

async function schedulePost(name, channelId, text, imageUrl, dueAt) {
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
        const err = parsed.errors?.[0]?.message;
        console.log(`${name}: ${type}${err ? ' - ' + err : ''}`);
        resolve(type);
      });
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  // Tight Lines - 12 PM MDT (18:00 UTC)
  await schedulePost(
    "TL midday engagement",
    tightLines,
    "Alright, anglers — real talk.\n\nWhat's the ONE piece of fishing gear you never leave home without?\n\nNot the rod. Not the reel. I'm talking the small stuff. The thing that saves the day when everything else goes sideways.\n\nDrop it in the comments 👇\n\nTight lines, KC",
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // Tight Lines - 3 PM MDT (21:00 UTC)
  await schedulePost(
    "TL what's working",
    tightLines,
    "🆕 What's Working This Week:\n\nPost-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.\n\nMeanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.\n\n⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇\n\nTight lines, KC",
    'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // Tight Lines - 6 PM MDT (00:00 UTC May 22)
  await schedulePost(
    "TL hook line thinker",
    tightLines,
    "🧠 HOOK, LINE & THINKER 🧠\n\nWhen a bass is feeding actively in the summer heat, what's the ONE water depth zone you should almost ALWAYS find them in?\n\nThink temperature, oxygen, and forage — that's your combo.\n\nAnswer in the comments 👇\n\nTight lines, KC",
    null,
    '2026-05-22T00:00:00.000Z'
  );

  // Camp Cook - 12 PM MDT
  await schedulePost(
    "CC midday engagement",
    campCook,
    "Hey Camp Cook community — quick question:\n\nWhat's your go-to method for making coffee while you're out in the field?\n\nFrench press? Cowboy method? Something else entirely?\n\nWe want to know what works for YOU. Drop it below 👇\n\nCamp Cook",
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // Camp Cook - 3 PM MDT
  await schedulePost(
    "CC afternoon hack",
    campCook,
    "🔧 CAMP KITCHEN HACK 🔧\n\nDutch oven tip that separates the newbs from the seasoned campfire cooks:\n\nWhen checking your coals, don't just eyeball the temperature — use the COUNT method.\n\nPlace your hand 12 inches above the coals and count:\n🔥 1-2 seconds = 450°F+ (too hot for most cooking)\n🔥 3-4 seconds = 350-450°F (good for breads/desserts)\n🔥 5-6 seconds = 300-350°F (perfect for stews and braises)\n🔥 7+ seconds = below 300°F (add more coal)\n\nSimple. No thermometer needed. Just your hand and some counting.\n\nSave this one for your next trip. 📲\n\nCamp Cook",
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // Camp Cook - 6 PM MDT
  await schedulePost(
    "CC evening hack",
    campCook,
    "🔧 CAMP KITCHEN HACK 🔧\n\nHere's a truth that catches a lot of people off-guard in the field:\n\nYou should NEVER wash your cast iron skillet at camp.\n\n❌ No soap\n❌ No scrubbing\n❌ No soaking\n\nInstead:\n✅ Wipe it out while still warm with a paper towel or natural fiber cloth\n✅ If there's stuck-on bits, pour in a bit of water, bring to a simmer, then scrape clean\n✅ Re-oil with a thin layer of camp-approved oil (olive, vegetable, or bacon fat)\n✅ Wipe dry and store\n\nSoap strips the seasoning. Soaking causes rust. And rust on a good skillet is just... sad.\n\nTake care of your gear and it'll feed you for decades.\n\nCamp Cook",
    'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=1200&fit=crop',
    '2026-05-22T00:00:00.000Z'
  );
}

main().catch(console.error);