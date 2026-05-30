const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a0508eb090476fb991916ce';

const text = `🎣 Tight Lines Tackle Box — Daily Forecast

📅 May 15, 2026 | Moon: Waning Crescent (2% illumination)
Major Feed: 10:47 AM – 12:47 PM
Minor Feed: 4:03 AM – 5:03 AM

🌅 Sunrise: 5:43 AM | 🌆 Sunset: 8:09 PM

New moon tomorrow means today is a transition day — fish are regrouping and feeding windows are tightening up. Focus on shaded areas and slower retrieves. Bass and walleye will be holding on mid-depth structure, waiting for the next major feed window.

Tight lines, KC`;

const imageUrl = 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&fit=crop';

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
    metadata: {
      facebook: {
        type: 'post'
      }
    },
    assets: [
      {
        image: {
          url: imageUrl
        }
      }
    ]
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