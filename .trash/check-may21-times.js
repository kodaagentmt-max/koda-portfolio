const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

async function fetchAllPosts() {
  let cursor = null;
  let allPosts = [];
  for (let page = 0; page < 20; page++) {
    const afterArg = cursor ? `, after: "${cursor}"` : '';
    const body = JSON.stringify({
      query: `{ posts(input: { organizationId: "${orgId}"${afterArg} }) { pageInfo { hasNextPage endCursor } edges { node { id channelId dueAt status text } } } }`
    });
    let rawData = '';
    await new Promise((resolve) => {
      const req = https.request({
        hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
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
  return allPosts;
}

async function main() {
  const allPosts = await fetchAllPosts();
  console.log(`Total posts: ${allPosts.length}\n`);
  
  const newIds = ['6a0f3a3cca1c441e6ef2d477','6a0f3a3c5f1705038cccc2ab','6a0f3a3dca1c441e6ef2d49b','6a0f3a3d3de67aaf7a4f969d','6a0f3a3e3de67aaf7a4f96d5','6a0f3a3eca1c441e6ef2d4e5'];
  
  const mine = allPosts.filter(e => newIds.includes(e.node.id));
  console.log(`My new posts: ${mine.length}\n`);
  mine.forEach(e => {
    const due = new Date(e.node.dueAt);
    console.log(`${e.node.id}`);
    console.log(`  Channel: ${e.node.channelId}`);
    console.log(`  Due UTC: ${e.node.dueAt}`);
    console.log(`  Due MDT: ${due.toLocaleString('en-US', {timeZone: 'America/Denver'})}`);
    console.log(`  Status: ${e.node.status}`);
    console.log(`  Text: ${e.node.text.substring(0,80)}...`);
    console.log();
  });
  
  // Also show any old test posts that should be deleted
  const oldTestIds = ['6a0f28a34da93737ea0b5593','6a0f27cee4f6caeb27031bd4'];
  console.log('\nOld test posts still in queue:');
  allPosts.filter(e => oldTestIds.includes(e.node.id)).forEach(e => {
    const due = new Date(e.node.dueAt);
    console.log(`  ${e.node.id} - ${e.node.status} - ${due.toLocaleString('en-US', {timeZone: 'America/Denver'})}`);
  });
}

main().catch(console.error);