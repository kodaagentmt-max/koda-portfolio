const https = require('https');

const API_KEY = 'yP5W0lsIf95Yt1-NSiForR_jPsPA8memS8SYQ-FOBvP';
const CHANNEL_ID = '6a0508eb090476fb991916ce';

const text = `🆕 What's Working This Week:

Chatterbait on shallow weed edges — Post-spawn bass are guarding fry and thrashing anything that intrudes their bed. The vibration + profile combo is absolutely crushing right now. White/chartreuse is the call of the week.

Ned Rig on 3/8oz heads — Yes, still. Late May bass are keying on bluegill beds adjacent to spawning flats, and the compact finesse profile matches the forage perfectly. Slow-roll it along secondary points and dock lines.

⚡ What lure is YOUR go-to right now? Drop it below 👇

Tight lines, KC`;

const imageUrl = "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=1200&fit=crop";

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
    metadata: { facebook: { type: "post" } },
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