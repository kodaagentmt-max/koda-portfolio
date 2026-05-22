const https = require('https');
const API_KEY = 'iu4MDDXkEqLqIWvJ5IGHXQyTHc1q4kXn87silpKeTsm';

const query = `
  query {
    __type(name: "ScheduleV2") {
      fields {
        name
      }
    }
  }
`;

const body = JSON.stringify({ query });
const options = {
  hostname: 'api.buffer.com', port: 443, path: '/1/graphql', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': `Bearer ${API_KEY}` }
};
const req = https.request(options, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log(data));
});
req.write(body);
req.end();