const https = require('https');

const POST_TEXT = `🔥 Camp Cook Tip:

Dutch Oven Campfire Beans

Forget opening a can — throw dried navy beans, salt pork, molasses, and mustard into your Dutch oven before heading out. Let that fire do the work while you're set up at camp. By dinner, you've got a rich, smoky side that goes with anything off the grill.

Key rig: Dutch oven, charcoal, dried navy beans, salt pork, molasses, yellow mustard

Give it a shot and let us know how it turned out 👇

Camp Cook`;

const IMAGE_URL = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&fit=crop';

const query = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post { id text status dueAt }
      }
      ... on PostActionError {
        code
        message
      }
    }
  }
`;

const variables = {
  input: {
    text: POST_TEXT,
    channelId: '6a051053090476fb99192c00',
    schedulingType: 'automatic',
    mode: 'addToQueue',
    metadata: { facebook: { type: 'post' } },
    assets: [{ image: { url: IMAGE_URL } }]
  }
};

const body = JSON.stringify({ query, variables });
const token = process.env.BUFFER_TOKEN;

const options = {
  hostname: 'api.buffer.com',
  port: 443,
  path: '/1/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', e => console.error('Error:', e));
req.write(body);
req.end();
