const puppeteer = require('puppeteer');

async function getSnapTikVideo(tiktokUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://snaptik.app', { waitUntil: 'networkidle2' });
    await page.type('#url', tiktokUrl);
    await page.click('.button-go');

    await page.waitForSelector('.video-links .button', { timeout: 15000 });

    const downloadLinks = await page.$$eval('.video-links .button', buttons =>
      buttons.map(btn => ({
        label: btn.innerText.trim(),
        url: btn.href
      }))
    );

    await browser.close();
    return { success: true, data: downloadLinks };
  } catch (err) {
    await browser.close();
    return { success: false, error: err.message };
  }
}

module.exports = getSnapTikVideo;
