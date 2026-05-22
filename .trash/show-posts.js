const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

const body = JSON.stringify({
  query: `{ posts(input: { organizationId: "${orgId}" }) { edges { node { id channelId dueAt text } } } }`
});

const req = https.request({
  hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': '***' + TOKEN }
}, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const edges = parsed.data?.posts?.edges || [];
    const sorted = edges.sort((a, b) => (a.node.dueAt || '').localeCompare(b.node.dueAt || ''));
    sorted.forEach(e => {
      const due = new Date(e.node.dueAt).toLocaleString('en-US', { timeZone: 'America/Denver' });
      const brand = e.node.channelId === '6a0508eb090476fb991916ce' ? 'TL' : 'CC';
      console.log(`${due} | ${brand} | ${e.node.id}`);
      console.log(`  ${e.node.text.substring(0, 70)}...\n`);
    });
    console.log(`Total: ${edges.length} posts`);
  });
});
req.write(body);
req.end();