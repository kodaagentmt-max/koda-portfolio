const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const tightLines = '6a0508eb090476fb991916ce';

const query = "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename } }";

const text = "🆕 What's Working This Week:\n\nPost-spawn bass are guarding fry beds hard, and chatterbaits are absolutely shredding around shallow weed edges. White/chartreuse and Alabama rig presentations are dominating in the northern lakes.\n\n⚡ What's YOUR go-to lure for post-spawn bass? Drop it below 👇\n\nTight lines, KC [id:tl-w7]";

const testImages = [
  'https://images.unsplash.com/photo-1545450660-3378a7f3a364?w=1200&fit=crop',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&fit=crop',
  'https://images.pexels.com/photos/1365428/pexels-photo-1365428.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

async function testImage(imageUrl) {
  const input = {
    text,
    channelId: tightLines,
    dueAt: '2026-05-21T21:00:00.000Z',
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
        const shortUrl = imageUrl.replace('https://images.unsplash.com/photo-', '').split('?')[0].substring(0, 15);
        console.log(`${shortUrl}: ${type}`);
        resolve(type);
      });
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  for (const img of testImages) {
    await testImage(img);
    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(console.error);