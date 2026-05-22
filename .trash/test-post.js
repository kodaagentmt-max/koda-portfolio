const https = require('https');

const TOKEN = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const campCook = '6a051053090476fb99192c00';
const tightLines = '6a0508eb090476fb991916ce';

const queryStr = '{"query":"mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { ... on PostActionSuccess { post { id dueAt } } } }","variables":{"input":{"text":"TEST","channelId":"6a0508eb090476fb991916ce","dueAt":"2026-05-21T18:00:00.000Z","schedulingType":"automatic","mode":"customScheduled","metadata":{"facebook":{"type":"post"}},"assets":[]}}}';

const body = queryStr;

const req = https.request({
  hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});
req.write(body);
req.end();