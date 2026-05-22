const https = require('https');

const TOKEN = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const campCook = '6a051053090476fb99192c00';
const tightLines = '6a0508eb090476fb991916ce';

const query = "mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename } }";

async function testPost(name, channelId, text, dueAt) {
  const input = {
    text,
    channelId,
    dueAt,
    schedulingType: "automatic",
    mode: "customScheduled",
    metadata: { facebook: { type: "post" } },
    assets: []
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
        console.log(`${name}: ${type}`);
        resolve(type);
      });
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Testing two posts at same dueAt...\n');
  await testPost('Post 1 CC 18:00', campCook, 'Camp Cook 1', '2026-05-21T18:00:00.000Z');
  await testPost('Post 2 CC 18:00', campCook, 'Camp Cook 2', '2026-05-21T18:00:00.000Z');
  await testPost('Post 3 TL 18:00', tightLines, 'Tight Lines 1', '2026-05-21T18:00:00.000Z');
  await testPost('Post 4 TL 21:00', tightLines, 'Tight Lines 2', '2026-05-21T21:00:00.000Z');
}

main().catch(console.error);