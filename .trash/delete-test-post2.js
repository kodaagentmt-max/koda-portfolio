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
  // Delete the test post "JAVA JUICE" scheduled for May 22
  await deletePost('6a0f27cee4f6caeb27031bd4');
  console.log('Done');
}

main().catch(console.error);