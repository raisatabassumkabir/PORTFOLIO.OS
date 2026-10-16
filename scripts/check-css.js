async function test() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  const cssMatches = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(m => m[1]);
  console.log('CSS links found:', cssMatches);
  for (const url of cssMatches) {
    const fullUrl = url.startsWith('http') ? url : 'http://localhost:3000' + url;
    const cssRes = await fetch(fullUrl);
    const cssText = await cssRes.text();
    console.log(fullUrl, 'status:', cssRes.status, 'bytes:', cssText.length);
    console.log('Preview:', cssText.substring(0, 200));
  }
}
test();
