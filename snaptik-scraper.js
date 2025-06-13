const puppeteer = require('puppeteer');

async function getSnapTikVideo(tiktokUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://vn.snaptik.com/', { waitUntil: 'networkidle2' });

    // Nhập URL TikTok vào ô input
    await page.type('#url', tiktokUrl);
    await page.click('.button.button-go');

    // Chờ link tải hiển thị (có thể thay đổi nếu SnapTik thay class)
    await page.waitForSelector('.video-links .button', { timeout: 15000 });

    // Lấy tất cả link tải
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
