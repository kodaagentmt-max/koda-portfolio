const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

const myIds = ['6a0f370d5715053406850cd3','6a0f370e2e13c372e70ace94','6a0f370ffb1847cd62b5318f','6a0f370f5f1705038cccb7df','6a0f370f2e13c372e70aceb7','6a0f37103de67aaf7a4f8d85'];

async function main() {
  let cursor = null;
  let allPosts = [];

  for (let page = 0; page < 10; page++) {
    const afterArg = cursor ? `, after: "${cursor}"` : '';
    const body = JSON.stringify({
      query: `{ posts(input: { organizationId: "${orgId}"${afterArg} }) { pageInfo { hasNextPage endCursor } edges { node { id channelId dueAt status text } } } }`
    });

    let rawData = '';
    await new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
      }, res => {
        res.on('data', c => rawData += c);
        res.on('end', () => resolve());
      });
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

  console.log(`Total posts found: ${allPosts.length}\n`);

  const mine = allPosts.filter(e => myIds.includes(e.node.id));
  console.log(`My posts: ${mine.length}\n`);
  mine.forEach(e => {
    const due = new Date(e.node.dueAt);
    console.log(`${e.node.id}`);
    console.log(`  Channel: ${e.node.channelId}`);
    console.log(`  Due (MDT): ${due.toLocaleString('en-US', {timeZone: 'America/Denver'})}`);
    console.log(`  Status: ${e.node.status}`);
    console.log();
  });

  // Show posts scheduled for May 21 that aren't mine
  console.log('\nOther posts scheduled for May 21:');
  allPosts.filter(e => e.node.dueAt?.startsWith('2026-05-21') && !myIds.includes(e.node.id))
    .forEach(e => {
      const due = new Date(e.node.dueAt);
      console.log(`  ${e.node.id} - ${e.node.channelId} - ${due.toLocaleString('en-US', {timeZone: 'America/Denver'})}`);
      console.log(`    ${e.node.text.substring(0,80)}...`);
    });
}

main().catch(console.error);