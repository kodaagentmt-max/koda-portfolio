const https = require('https');

// Try the workspace-level API key
const apiKey = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';

const postText = `🆕 What's Working This Week:

🇺🇸 Chatterbait has been absolutely crushing bass on shallow weed edges post-spawn. The vibration and profile are irresistible to females guarding fry. White/chartreuse is the color combo of the week.

🇺🇸 Ned Rig on a 3/8oz head — yes, still. The compact profile matches the forage perfectly right now and bass can't seem to refuse it. Finesse without sacrificing hookups.

⚡ What lure is YOUR go-to right now? Drop it below 👇

Tight lines, KC`;

const imageUrl = "https://images.unsplash.com/photo-1472591651607-70e2d88ae3c4?w=1200&fit=crop";

const mutation = `
mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    success
    message
  }
}`;

const variables = {
  input: {
    text: postText,
    channelId: "6a0508eb090476fb991916ce",
    mode: "addToQueue",
    schedulingType: "automatic",
    metadata: { facebook: { type: "post" } },
    assets: [{ image: { url: imageUrl } }]
  }
};

const body = JSON.stringify({ query: mutation, variables });

const options = {
  hostname: 'api.buffer.com',
  path: '/graphql',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
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
  console.error('Request error:', e.message);
});

req.write(body);
req.end();
