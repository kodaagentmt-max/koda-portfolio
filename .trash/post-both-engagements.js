const https = require('https');
const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';

const query = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess {
        post { id text status dueAt }
      }
    }
  }
`;

function post(channelId, text, imageUrl) {
  const variables = {
    input: {
      text: text,
      channelId: channelId,
      schedulingType: 'automatic',
      mode: 'addToQueue',
      metadata: { facebook: { type: 'post' } },
      assets: imageUrl ? [{ image: { url: imageUrl } }] : []
    }
  };

  const body = JSON.stringify({ query, variables });
  const opts = {
    hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': `Bearer ${API_KEY}` }
  };

  return new Promise((resolve) => {
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log('Result:', data);
        resolve(data);
      });
    });
    req.write(body);
    req.end();
  });
}

async function main() {
  // Tight Lines engagement with relevant fishing image
  await post(
    '6a0508eb090476fb991916ce',
    "What's the one piece of fishing gear you refuse to leave home without?\n\nDrop your answer below 👇\n\nTight Lines, KC",
    'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1200'
  );

  // Camp Cook engagement with camping image
  await post(
    '6a051053090476fb99192c00',
    "What's your go-to camp breakfast when you're camping in cold weather — and what's the one mistake most people make cooking it?\n\nDrop your answer below 👇\n\nCamp Cook",
    'https://images.pexels.com/photos/266659/pexels-photo-266659.jpeg?auto=compress&cs=tinysrgb&w=1200'
  );
}

main();