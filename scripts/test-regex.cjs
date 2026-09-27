const https = require('https');

function extractRatingFromText(text) {
  const patterns = [
    /(\d\.\d)\s*Google rating/i,
    /Google rating.*?(\d\.\d)/i,
    /rated\s*(\d\.\d)\s*(?:of|\/)\s*5/i,
    /rating:\s*(\d\.\d)/i,
    /(\d\.\d)\s*(?:stars|★)/i,
    /(\d\.\d)\s*out of 5/i,
    /rating of\s*(\d\.\d)/i,
    /score of\s*(\d\.\d)/i
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) {
      const val = parseFloat(m[1]);
      if (val >= 3.0 && val <= 5.0) return val;
    }
  }
  return null;
}

const s4 = "Topping the 2026 ranking of Europe's 50 best cocktail bars, Athens' Line Bar also holds the title of Best Bar in Greece, with a 4.4 Google rating across nearly 2,500 reviews.";
console.log('Extracted:', extractRatingFromText(s4));
