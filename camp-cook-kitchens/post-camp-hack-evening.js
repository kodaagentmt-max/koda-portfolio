const https = require('https');

const API_KEY = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const CHANNEL_ID = '6a051053090476fb99192c00';

const text = `🏕️ Camp Kitchen Hack:

Freeze Your Ground Coffee in Portion-Sized Bag

Stop wrestling with a bulky coffee bag at camp. Portion your grounds into freezer bags before you leave — each bag = one brew. They stay fresh, pack flat, and you just toss the bag when you're done.

No measuring. No mess. No problem.

Give it a shot and let us know how it turned out 👇

Camp Cook`;

const imageUrl = 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?w=1200&fit=crop';

const query = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post {
          id
          text
          createdAt
          status
        }
      }
    }
  }
`;

const variables = {
  input: {
    text: text,
    channelId: CHANNEL_ID,
    schedulingType: 'automatic',
    mode: 'addToQueue',
    metadata: { facebook: { type: 'post' } },
    assets: [{ image: { url: imageUrl } }]
  }
};

const body = JSON.stringify({ query, variables });

const options = {
  hostname: 'api.buffer.com',
  port: 443,
  path: '/1/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Authorization': `Bearer ${API_KEY}`
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

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(body);
req.end();