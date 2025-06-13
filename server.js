const express = require('express');
const cors = require('cors');
const getSnapTikVideo = require('./snaptik-scraper');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/snaptik', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ msg: "'url' is required" });

  const result = await getSnapTikVideo(url);
  if (result.success) {
    res.json({ code: 0, data: result.data });
  } else {
    res.status(500).json({ code: -1, msg: result.error });
  }
});

app.listen(3000, () => console.log('SnapTik Puppeteer API running on http://localhost:3000'));
