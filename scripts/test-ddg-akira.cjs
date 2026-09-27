const https = require('https');

async function testDDG(q) {
  const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
  return new Promise(resolve => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const idx = data.indexOf('4.8');
        console.log('DDG contains 4.8?', idx !== -1);
        const snippets = data.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g) || [];
        snippets.forEach((s, i) => console.log(i, s.replace(/<[^>]+>/g, '').trim()));
        resolve();
      });
    });
  });
}
testDDG('Akira Sushi Bar Athens');
