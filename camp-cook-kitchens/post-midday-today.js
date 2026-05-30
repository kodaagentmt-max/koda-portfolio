const https = require('https');
const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a051053090476fb99192c00';
const text = `What's one camp cooking hack you swear by that changed your outdoor meal game?

Drop your answer below 👇

Camp Cook`;

const query = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post { id text createdAt status }
      }
    }
  }
`;

const variables = {
  input: {
    text: text,
    channelId: CHANNEL_ID,
    schedulingType: 'notification',
    mode: 'addToQueue',
    metadata: { facebook: { type: 'post' } }
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