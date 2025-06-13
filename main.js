fetch('https://snaptok-production.up.railway.app/api/snaptik', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: tiktokUrl })
});
