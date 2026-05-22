const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('/home/kodaagentmt/.openclaw/openclaw.json', 'utf8'));
const TOKEN = config.plugins.entries.buffer.config.accessToken;
const orgId = config.plugins.entries.buffer.config.organizationId;

const myIds = ['6a0f370d5715053406850cd3','6a0f370e2e13c372e70ace94','6a0f370ffb1847cd62b5318f','6a0f370f5f1705038cccb7df','6a0f370f2e13c372e70aceb7','6a0f37103de67aaf7a4f8d85'];

async function deletePost(id) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      query: `mutation { deletePost(input: { id: "${id}" }) { __typename } }`
    });
    const req = https.request({
      hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + TOKEN }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        const result = parsed.data?.deletePost;
        console.log(`${id}: ${result?.__typename}`);
        resolve();
      });
    });
    req.write(body);
    req.end();
  });
}

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
  console.log('Fetching all posts...\n');
  const allPosts = await fetchAllPosts();
  console.log(`Total posts: ${allPosts.length}\n`);
  
  const mine = allPosts.filter(e => myIds.includes(e.node.id));
  console.log(`Found ${mine.length} of my posts:\n`);
  for (const e of mine) {
    const due = new Date(e.node.dueAt);
    console.log(`${e.node.id} - ${e.node.channelId}`);
    console.log(`  Due: ${due.toLocaleString('en-US', {timeZone: 'America/Denver'})}`);
    console.log(`  Status: ${e.node.status}`);
    console.log(`  Text: ${e.node.text.substring(0,80)}...`);
    console.log();
  }
  
  console.log('\nAttempting to delete my posts...');
  for (const id of myIds) {
    await deletePost(id);
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);