const https = require('https');
const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a0508eb090476fb991916ce';
const text = `What's the one piece of fishing gear you refuse to leave home without?

Drop your answer below 👇

Tight Lines, KC`;
const imageUrl = 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=1200&fit=crop';

const query = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post { id text createdAt status dueAt }
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

const req = https.request(options, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log('Result:', data));
});
req.write(body);
req.end();