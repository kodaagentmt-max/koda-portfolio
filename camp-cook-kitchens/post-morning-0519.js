const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a051053090476fb99192c00';

const IMAGE_URL = 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=1200&fit=crop';

const text = `🏕️ Camp Cook Kitchens — Morning Brief

Spring Mack Days 2026 wrapped up May 9 on Flathead Lake, Montana — anglers logged 37,975 lake trout entries across the event, with Kolton Turner taking top honors while promoting conservation and community stewardship throughout the competition.

The Falcon Grand Challenge bass tournament returned May 16 with results in: Travis Spears brought in the Big Bass at 3.49 lbs to lead the pack, with the full standings available at falcongrandchallenge.com.

The 2026 Striper Cup is in full swing — Week 2 winners have been crowned as spring striped bass migration hits its peak, and Week 3 prizes from YETI and Greys Fishing are up for grabs through mid-May.

Source: Montana Outdoor, Falcon Grand Challenge, Striper Cup

Happy Tuesday, KC`;

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

const assets = [{ image: { url: IMAGE_URL } }];

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
    },
    assets: assets
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
    const result = JSON.parse(data);
    if (result.data && result.data.createPost && result.data.createPost.post) {
      console.log('Post ID:', result.data.createPost.post.id);
      console.log('Status:', result.data.createPost.post.status);
    } else {
      console.log('Response:', JSON.stringify(result, null, 2));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(body);
req.end();
