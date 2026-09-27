const https = require('https');
const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent('Line Athens bar restaurant google maps rating');
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const snippets = data.match(/<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g) || [];
    snippets.slice(0, 5).forEach((s, i) => console.log(i, s.replace(/<[^>]+>/g, '').trim()));
  });
});
