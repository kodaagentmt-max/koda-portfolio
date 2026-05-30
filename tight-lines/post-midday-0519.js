const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';
const CHANNEL_ID = '6a0508eb090476fb991916ce';

const text = `What's the one fishing technique you've perfected that you'd teach to any beginner?

Drop your answer below 👇

Tight Lines, KC`;

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
    schedulingType: 'notification',
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