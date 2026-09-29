async function check() {
  const res = await fetch('https://maxventure.vercel.app');
  const html = await res.text();
  console.log('HTML snippet:', html.slice(0, 500));
  const scriptMatch = html.match(/src="([^"]+index[^"]+\.js)"/);
  console.log('Script match:', scriptMatch ? scriptMatch[1] : null);
  if (scriptMatch) {
    const jsRes = await fetch('https://maxventure.vercel.app' + scriptMatch[1]);
    const js = await jsRes.text();
    console.log('Has מפת יום:', js.includes('מפת יום'));
    console.log('Has combinedWithDay:', js.includes('combinedWithDay'));
  }
}
check();
