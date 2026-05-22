const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

// Test both queries
const body1 = JSON.stringify({
  query: `{ posts(input: { organizationId: "${orgId}" }) { edges { node { id dueAt text channelId } } } }`
});

const body2 = JSON.stringify({
  query: `{ channels { name id } }`
});

function runQuery(body, label) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': '***' + TOKEN }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        const edges = parsed.data?.posts?.edges;
        console.log(`${label}: Status ${res.statusCode}, posts=${edges ? edges.length : 'error'}`);
        if (edges && edges.length > 0) {
          edges.forEach(e => {
            const due = new Date(e.node.dueAt).toLocaleString('en-US', { timeZone: 'America/Denver' });
            console.log(`  ${due} | ${e.node.text.substring(0,50)}...`);
          });
        }
        resolve();
      });
    });
    req.write(body);
    req.end();
  });
}

(async () => {
  await runQuery(body1, 'Posts query');
  await runQuery(body2, 'Channels query');
})();