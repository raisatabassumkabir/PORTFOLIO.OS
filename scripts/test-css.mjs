async function check() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  console.log('HTML length:', html.length);
  const matches = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)];
  console.log('CSS links found:', matches.map(m => m[1]));
  for (const m of matches) {
    const cssRes = await fetch('http://localhost:3000' + m[1]);
    const css = await cssRes.text();
    console.log(`CSS (${m[1]}) length: ${css.length}, preview:`, css.slice(0, 300));
  }
}
check().catch(console.error);
