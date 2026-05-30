const https = require('https');
const fs = require('fs');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a0508eb090476fb991916ce';

const postType = process.argv[2] || 'morning'; // morning, midday, afternoon
const imageUrl = process.argv[3] || null;

// Load photo library for image rotation
let selectedImage = null;
if (imageUrl) {
  selectedImage = imageUrl;
} else if (postType !== 'midday') {
  // Auto-select an image for morning/afternoon posts
  const photoLib = JSON.parse(fs.readFileSync('/workspace/tight-lines/content/photo-library.json', 'utf8'));
  const images = photoLib.images;
  selectedImage = images[Math.floor(Math.random() * images.length)].url;
}

// Get today's date info
const now = new Date();
const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

let text = '';

if (postType === 'morning') {
  text = `🎣 Tight Lines Tackle Box — Daily Forecast

📅 ${dateStr} | Moon: Waning Crescent (2% illumination)
Major Feed: 10:47 AM – 12:47 PM
Minor Feed: 4:03 AM – 5:03 AM

🌅 Sunrise: 5:43 AM | 🌆 Sunset: 8:09 PM

New moon tomorrow means today is a transition day — fish are regrouping and feeding windows are tightening up. Focus on shaded areas and slower retrieves. Bass and walleye will be holding on mid-depth structure, waiting for the next major feed window.

Tight lines, KC`;
} else if (postType === 'midday') {
  text = `What's your go-to lure when the fish aren't biting? Drop it below 👇

Tight lines, KC`;
} else if (postType === 'afternoon') {
  text = `🆕 What's Working This Week:

Kalin's Worm Walker Spoon — Finesse spoon fishing is having a moment, and this new walker delivers a unique tail-wagging, hovering action that triggers curious bass and walleye into striking. Rig it with a nightcrawler or soft plastic for max effect.

Moonshine Rattling Shiver Minnow — Same legendary Shiver action tournament pros swear by, now with an integrated rattle system that calls fish in from a distance. Same great paint schemes, twice the attraction.

⚡ What lure is YOUR go-to right now? Drop it below 👇

Tight lines, KC`;
}

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

const assets = selectedImage ? [{ image: { url: selectedImage } }] : [];

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
      if (selectedImage) console.log('Image:', selectedImage);
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