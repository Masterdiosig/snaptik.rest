const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/download', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'Thiếu URL video TikTok' });

  try {
    const response = await axios.get('https://www.tikwm.com/api/', {
      params: { url: videoUrl }
    });

    if (response.data.code !== 0) {
      return res.status(400).json({ error: 'Không tìm thấy video' });
    }

    res.json({
      no_watermark: response.data.data.play,
      hd: response.data.data.hdplay
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server hoặc API' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server TikWM đang chạy tại http://localhost:${PORT}`);
});
