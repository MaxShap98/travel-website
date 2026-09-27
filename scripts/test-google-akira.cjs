const https = require('https');
const fs = require('fs');

async function testGoogle(q) {
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(q) + '&hl=en';
  return new Promise(resolve => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        fs.writeFileSync('scripts/google-res.html', data);
        console.log('Saved html of length:', data.length);
        // Search for 4.8
        const idx = data.indexOf('4.8');
        console.log('Contains 4.8?', idx !== -1);
        if (idx !== -1) {
          console.log('Snippet around 4.8:', data.substring(idx - 50, idx + 100));
        }
        resolve();
      });
    });
  });
}
testGoogle('Akira Sushi Bar Athens');
