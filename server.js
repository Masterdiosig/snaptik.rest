const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/snaptik', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ msg: "'url' is required" });

  try {
    const response = await axios.get('https://tiktok-video-no-watermark2.p.rapidapi.com/', {
      params: { url },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      }
    });

    const result = response.data;
    res.json({ code: 0, data: result.data });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ code: -1, msg: 'Không thể lấy video từ TikTok.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
