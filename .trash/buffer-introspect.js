const https = require('https');

const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';

const query = `
  query {
    __schema {
      types {
        name
        fields {
          name
        }
      }
    }
  }
`;

const body = JSON.stringify({ query });

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
    try {
      const parsed = JSON.parse(data);
      if (parsed.data && parsed.data.__schema && parsed.data.__schema.types) {
        const types = parsed.data.__schema.types.filter(t => 
          t.name.toLowerCase().includes('update') || 
          t.name.toLowerCase().includes('post') ||
          t.name.toLowerCase().includes('mutation') ||
          t.name.toLowerCase().includes('create')
        );
        console.log('Relevant types:', JSON.stringify(types, null, 2));
      } else {
        console.log('Response:', JSON.stringify(parsed, null, 2).substring(0, 3000));
      }
    } catch(e) {
      console.log('Raw response:', data.substring(0, 3000));
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(body);
req.end();
