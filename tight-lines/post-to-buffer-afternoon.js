const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a0508eb090476fb991916ce';

const text = `🆕 What's Working This Week:

Kalin's Worm Walker Spoon — Finesse spoon fishing is having a moment, and this new walker delivers a unique tail-wagging, hovering action that triggers curious bass and walleye into striking. Rig it with a nightcrawler or soft plastic for max effect.

Moonshine Rattling Shiver Minnow — Same legendary Shiver action tournament pros swear by, now with an integrated rattle system that calls fish in from a distance. Same great paint schemes, twice the attraction.

⚡ What lure is YOUR go-to right now? Drop it below 👇

Tight lines, KC`;

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
      ... on PostActionError {
        errorCode
        message
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
    metadata: {
      facebook: {
        type: 'post'
      }
    }
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