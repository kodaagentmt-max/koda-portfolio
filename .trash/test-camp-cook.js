const https = require('https');

const TOKEN = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const campCook = '6a051053090476fb99192c00';

const query = "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { ... on PostActionSuccess { post { id dueAt } } } }";

async function post(channelId, text, imageUrl, dueAt) {
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
        const id = parsed.data?.createPost?.post?.id;
        console.log(id ? '✅ ' + id : '❌ ' + data.substring(0, 300));
        resolve(id);
      });
    });
    req.on('error', e => { console.log('❌ Network:', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

async function main() {
  const texts = [
    { name: "Camp Cook coffee question", text: "Hey Camp Cook community — quick question:\n\nWhat's your go-to method for making coffee while you're out in the field?\n\nFrench press? Cowboy method? Something else entirely?\n\nWe want to know what works for YOU. Drop it below 👇\n\nCamp Cook" },
    { name: "Dutch oven hack", text: "🔧 CAMP KITCHEN HACK 🔧\n\nDutch oven tip that separates the newbs from the seasoned campfire cooks:\n\nWhen checking your coals, don't just eyeball the temperature — use the COUNT method.\n\nPlace your hand 12 inches above the coals and count:\n🔥 1-2 seconds = 450°F+ (too hot for most cooking)\n🔥 3-4 seconds = 350-450°F (good for breads/desserts)\n🔥 5-6 seconds = 300-350°F (perfect for stews and braises)\n🔥 7+ seconds = below 300°F (add more coal)\n\nSimple. No thermometer needed. Just your hand and some counting.\n\nSave this one for your next trip. 📲\n\nCamp Cook" },
    { name: "Cast iron hack", text: "🔧 CAMP KITCHEN HACK 🔧\n\nHere's a truth that catches a lot of people off-guard in the field:\n\nYou should NEVER wash your cast iron skillet at camp.\n\n❌ No soap\n❌ No scrubbing\n❌ No soaking\n\nInstead:\n✅ Wipe it out while still warm with a paper towel or natural fiber cloth\n✅ If there's stuck-on bits, pour in a bit of water, bring to a simmer, then scrape clean\n✅ Re-oil with a thin layer of camp-approved oil (olive, vegetable, or bacon fat)\n✅ Wipe dry and store\n\nSoap strips the seasoning. Soaking causes rust. And rust on a good skillet is just... sad.\n\nTake care of your gear and it'll feed you for decades.\n\nCamp Cook" }
  ];

  for (const t of texts) {
    console.log('Testing:', t.name);
    await post(campCook, t.text, null, '2026-05-21T18:00:00.000Z');
    await new Promise(r => setTimeout(r, 500));
  }
}

main().catch(console.error);