/**
 * Schedule all remaining posts for May 21, 2026
 * Tight Lines (3 posts: midday engagement, afternoon whatsmissing, evening hook line thinker)
 * Camp Cook (3 posts: midday engagement, afternoon hack, evening hack)
 */

const https = require('https');

const TOKEN = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const CHANNELS = {
  tightLines: '6a0508eb090476fb991916ce',
  campCook: '6a051053090476fb99192c00'
};

function graphql(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables });
    const req = https.request({
      hostname: 'api.buffer.com',
      path: '/1/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Authorization': `Bearer ${TOKEN}`
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error(data)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function createPost(channelId, text, scheduledAt, imageUrl = null) {
  const assets = imageUrl ? [{ image: { url: imageUrl } }] : [];
  const result = await graphql(
    `mutation CreatePost($input: PostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post { id }
        }
        ... on PostActionError {
          message
        }
      }
    }`,
    {
      input: {
        text,
        channelId,
        scheduledAt,
        schedulingType: 'automatic',
        mode: 'addToQueue',
        metadata: { facebook: { type: 'post' } },
        assets
      }
    }
  );
  return result;
}

async function main() {
  const posts = [];

  // === TIGHT LINES ===
  // 1. Midday Engagement - 12 PM
  posts.push(createPost(
    CHANNELS.tightLines,
    `Alright, anglers — real talk.

What's the ONE piece of fishing gear you never leave home without?

Not the rod. Not the reel. I'm talking the small stuff. The thing that saves the day when everything else goes sideways.

Drop it in the comments 👇

Tight lines, KC`,
    '2026-05-21T18:00:00.000Z' // 12 PM MDT = 18:00 UTC
  ));

  // 2. Afternoon - 3 PM MDT = 21:00 UTC — "What's Working This Week" (not Hook Line & Thinker)
  posts.push(createPost(
    CHANNELS.tightLines,
    `🆕 What's Working This Week:

Post-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.

Meanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.

⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇

Tight lines, KC`,
    '2026-05-21T21:00:00.000Z', // 3 PM MDT
    'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=1200&fit=crop'
  ));

  // 3. Evening Hook Line & Thinker - 6 PM MDT = 00:00 UTC next day
  posts.push(createPost(
    CHANNELS.tightLines,
    `🧠 HOOK, LINE & THINKER 🧠

When a bass is feeding actively in the summer heat, what's the ONE water depth zone you should almost ALWAYS find them in?

Think temperature, oxygen, and forage — that's your combo.

Answer in the comments 👇

Tight lines, KC`,
    '2026-05-22T00:00:00.000Z' // 6 PM MDT May 21 = 00:00 UTC May 22
  ));

  // === CAMP COOK ===
  // 4. Midday Engagement - 12 PM
  posts.push(createPost(
    CHANNELS.campCook,
    `Hey Camp Cook community — quick question:

What's your go-to method for making coffee while you're out in the field?

French press? Cowboy method? Something else entirely?

We want to know what works for YOU. Drop it below 👇

Camp Cook`,
    '2026-05-21T18:00:00.000Z'
  ));

  // 5. Afternoon Camp Kitchen Hack - 3 PM
  posts.push(createPost(
    CHANNELS.campCook,
    `🔧 CAMP KITCHEN HACK 🔧

Dutch oven tip that separates the newbs from the seasoned campfire cooks:

When checking your coals, don't just eyeball the temperature — use the COUNT method.

Place your hand 12 inches above the coals and count:
🔥 1-2 seconds = 450°F+ (too hot for most cooking)
🔥 3-4 seconds = 350-450°F (good for breads/desserts)
🔥 5-6 seconds = 300-350°F (perfect for stews and braises)
🔥 7+ seconds = below 300°F (add more coal)

Simple. No thermometer needed. Just your hand and some counting.

Save this one for your next trip. 📲

Camp Cook`,
    '2026-05-21T21:00:00.000Z',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop'
  ));

  // 6. Evening Camp Kitchen Hack - 6 PM
  posts.push(createPost(
    CHANNELS.campCook,
    `🔧 CAMP KITCHEN HACK 🔧

Here's a truth that catches a lot of people off-guard in the field:

You should NEVER wash your cast iron skillet at camp.

❌ No soap
❌ No scrubbing
❌ No soaking

Instead:
✅ Wipe it out while still warm with a paper towel or natural fiber cloth
✅ If there's stuck-on bits, pour in a bit of water, bring to a simmer, then scrape clean
✅ Re-oil with a thin layer of camp-approved oil (olive, vegetable, or bacon fat)
✅ Wipe dry and store

Soap strips the seasoning. Soaking causes rust. And rust on a good skillet is just... sad.

Take care of your gear and it'll feed you for decades.

Camp Cook`,
    '2026-05-22T00:00:00.000Z',
    'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=1200&fit=crop'
  ));

  const results = await Promise.all(posts);
  results.forEach((r, i) => {
    const status = r.data?.createPost?.post?.id ? '✅' : '❌';
    console.log(`${status} Post ${i+1}: ${JSON.stringify(r.data?.createPost)}`);
  });
}

main().catch(console.error);