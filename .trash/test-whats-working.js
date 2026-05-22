const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const tightLines = '6a0508eb090476fb991916ce';

const query = "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename } }";

const whatsWorkingText = "🆕 What's Working This Week:\n\nPost-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.\n\nMeanwhile, ned rig fans — don't sleep on those secondary points. Bass are stacking up on transitions between flat spawning flats and deeper water. SLOW roll that ned.\n\n⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇\n\nTight lines, KC [id:tl-wk2]";

const input = {
  text: whatsWorkingText,
  channelId: tightLines,
  dueAt: '2026-05-21T21:00:00.000Z',
  schedulingType: "automatic",
  mode: "customScheduled",
  metadata: { facebook: { type: "post" } },
  assets: [{ image: { url: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=1200&fit=crop" } }]
};

const body = JSON.stringify({ query, variables: { input } });

const req = https.request({
  hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Result:', data);
  });
});
req.write(body);
req.end();