const https = require('https');

async function getGoogleRating(query) {
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(query + ' google maps rating') + '&hl=en';
  return new Promise(resolve => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for Google ratings in HTML
        const match = data.match(/aria-label="Rated\s*(\d\.\d)\s*out of 5/i) ||
                      data.match(/(\d\.\d)\s*★/i) ||
                      data.match(/(\d\.\d)\s*stars/i) ||
                      data.match(/(\d\.\d)\s*\(\d+[\d,]*\)/) ||
                      data.match(/Rating:\s*(\d\.\d)/i) ||
                      data.match(/(\d\.\d)\s*out of 5/i);
        console.log('Search response length:', data.length);
        console.log('Match for', query, ':', match ? match[0] : 'null');
        resolve(match ? parseFloat(match[1]) : null);
      });
    }).on('error', (e) => {
      console.error(e);
      resolve(null);
    });
  });
}

getGoogleRating('Line Athens restaurant').then(r => console.log('Parsed rating:', r));
