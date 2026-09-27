const https = require('https');

function extractRating(html) {
  const patterns = [
    /(\d\.\d)\s*Google rating/i,
    /Google rating.*?(\d\.\d)/i,
    /rated\s*(\d\.\d)\s*(?:of|\/)\s*5/i,
    /rating:\s*(\d\.\d)/i,
    /(\d\.\d)\s*out of 5/i,
    /rating of\s*(\d\.\d)/i,
    /(\d\.\d)\s*(?:stars|★)/i,
    /score of\s*(\d\.\d)/i
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1]) {
      const val = parseFloat(m[1]);
      if (val >= 3.0 && val <= 5.0) return val;
    }
  }
  return null;
}

async function searchRating(placeName, city = 'Athens') {
  const query = `${placeName} ${city} google maps rating reviews`;
  const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        resolve(extractRating(data));
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const testPlaces = ['Line Athens', 'Seychelles Athens', 'Dionysos Zonar', 'Six D.o.g.s Athens'];
  for (const p of testPlaces) {
    const r = await searchRating(p);
    console.log(p, '-> Rating:', r);
  }
}
run();
