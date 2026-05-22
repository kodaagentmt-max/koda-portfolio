const https = require('https');

const TOKEN = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';

const query = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post { id dueAt }
      }
    }
  }
`;

function post(channelId, text, imageUrl, dueAt) {
  const variables = {
    input: {
      text,
      channelId,
      dueAt,
      schedulingType: 'automatic',
      mode: 'customScheduled',
      metadata: { facebook: { type: 'post' } },
      assets: imageUrl ? [{ image: { url: imageUrl } }] : []
    }
  };

  const body = JSON.stringify({ query, variables });
  const opts = {
    hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': `Bearer ${TOKEN}` }
  };

  return new Promise((resolve) => {
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        const id = parsed.data?.createPost?.post?.id;
        const err = parsed.errors?.[0]?.message;
        if (id) {
          console.log(`✅ Scheduled ${id} for ${dueAt}`);
        } else {
          console.log(`❌ Failed: ${err}`);
        }
        resolve(data);
      });
    });
    req.on('error', e => { console.error('Network error:', e.message); resolve(null); });
    req.write(body);
    req.end();
  });
}

async function main() {
  const campCook = '6a051053090476fb99192c00';
  const tightLines = '6a0508eb090476fb991916ce';

  // MDT to UTC:
  // 12:00 MDT = 18:00 UTC
  // 15:00 MDT = 21:00 UTC
  // 18:00 MDT = 00:00 UTC next day

  // === TIGHT LINES ===
  // 1. Midday Engagement - 12 PM MDT May 21
  await post(tightLines,
    `Alright, anglers — real talk.

What's the ONE piece of fishing gear you never leave home without?

Not the rod. Not the reel. I'm talking the small stuff. The thing that saves the day when everything else goes sideways.

Drop it in the comments 👇

Tight lines, KC`,
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // 2. What's Working This Week - 3 PM MDT May 21
  await post(tightLines,
    `🆕 What's Working This Week:

Post-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.

Meanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.

⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇

Tight lines, KC`,
    'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // 3. Hook Line & Thinker - 6 PM MDT May 21
  await post(tightLines,
    `🧠 HOOK, LINE & THINKER 🧠

When a bass is feeding actively in the summer heat, what's the ONE water depth zone you should almost ALWAYS find them in?

Think temperature, oxygen, and forage — that's your combo.

Answer in the comments 👇

Tight lines, KC`,
    null,
    '2026-05-22T00:00:00.000Z'
  );

  // === CAMP COOK ===
  // 4. Midday Engagement - 12 PM MDT May 21
  await post(campCook,
    `Hey Camp Cook community — quick question:

What's your go-to method for making coffee while you're out in the field?

French press? Cowboy method? Something else entirely?

We want to know what works for YOU. Drop it below 👇

Camp Cook`,
    null,
    '2026-05-21T18:00:00.000Z'
  );

  // 5. Camp Kitchen Hack - 3 PM MDT May 21
  await post(campCook,
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
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop',
    '2026-05-21T21:00:00.000Z'
  );

  // 6. Camp Kitchen Hack - 6 PM MDT May 21
  await post(campCook,
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
    'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=1200&fit=crop',
    '2026-05-22T00:00:00.000Z'
  );

  console.log('\nDone!');
}

main();