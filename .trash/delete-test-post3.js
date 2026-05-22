const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;

async function deletePost(id) {
  const body = JSON.stringify({
    query: `mutation { deletePost(input: { id: "${id}" }) { __typename } }`
  });
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        console.log(`Deleted ${id}: ${parsed.data?.deletePost?.__typename}`);
        resolve();
      });
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  // Delete "Who needs sleep?" test post
  await deletePost('6a0f26ca2a777c569a00b709');
  console.log('Done');
}

main().catch(console.error);