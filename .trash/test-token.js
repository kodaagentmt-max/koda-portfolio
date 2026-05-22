const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;

// Simple test - try creating a post
const query = JSON.stringify({
  query: `mutation { createPost(input: { text: "Buffer test", channelId: "6a0508eb090476fb991916ce", schedulingType: automatic, mode: addToQueue, metadata: { facebook: { type: "post" } } }) { __typename } }`
});

const req = https.request({
  hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(query), 'Authorization': '***' + TOKEN }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data.substring(0, 300));
  });
});
req.write(query);
req.end();