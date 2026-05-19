const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a0508eb090476fb991916ce';

const IMAGE_URL = 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=1200&fit=crop';

const text = `🎣 Tight Lines Tackle Box — Daily Forecast

📅 May 19, 2026 | Moon: Waxing Crescent (7% illumination)
Major Feed: 9:30 AM – 11:30 AM
Minor Feed: 6:15 AM – 7:15 AM

🌅 Sunrise: 5:42 AM | 🌆 Sunset: 8:11 PM

Cool morning with clouds rolling through — prime time for bass and trout. Fish will be most active during the major feed window before the afternoon warmth pushes them deeper. Try a slow-moving jerkbait or soft plastic along shaded transition zones near creek channels.

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
