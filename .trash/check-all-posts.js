const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

async function main() {
  let cursor = null;
  let allPosts = [];
  for (let page = 0; page < 5; page++) {
    const afterArg = cursor ? `, after: "${cursor}"` : '';
    const body = JSON.stringify({
      query: `{ posts(input: { organizationId: "${orgId}"${afterArg} }) { pageInfo { hasNextPage endCursor } edges { node { id channelId dueAt status text } } } }`
    });
    let rawData = '';
    await new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': '***' + TOKEN }
      }, res => { res.on('data', c => rawData += c); res.on('end', () => resolve()); });
      req.write(body);
      req.end();
    });
    const parsed = JSON.parse(rawData);
    const edges = parsed.data?.posts?.edges || [];
    allPosts.push(...edges);
    const result = parsed.data?.posts;
    if (!result?.pageInfo?.hasNextPage) break;
    cursor = result.pageInfo.endCursor;
  }

  console.log(`Total posts: ${allPosts.length}`);

  const sorted = allPosts.sort((a, b) => (a.node.dueAt || '').localeCompare(b.node.dueAt || ''));
  sorted.forEach(e => {
    const due = e.node.dueAt ? new Date(e.node.dueAt).toLocaleString('en-US', { timeZone: 'America/Denver' }) : 'NO-DATE';
    const brand = e.node.channelId === '6a0508eb090476fb991916ce' ? 'TL' : 'CC';
    console.log(`${due} | ${brand} | ${e.node.id} | ${e.node.status} | ${e.node.text.substring(0,70)}...`);
  });
}

main().catch(console.error);