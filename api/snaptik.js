const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const followRedirect = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, { maxRedirects: 5 });
    return response.request.res.responseUrl || shortUrl;
  } catch {
    return shortUrl;
  }
};

app.post("/api/snaptik", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  try {
    const finalUrl = await followRedirect(url);

    const apiRes = await axios.get("https://tiktok-video-downloader-api.p.rapidapi.com/media", {
      params: { videoUrl: finalUrl },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-video-downloader-api.p.rapidapi.com"
      }
    });

    const data = apiRes.data;

    res.status(200).json({
      code: 0,
      description: data.description || "",
      thumbnail: data.cover || "",
      noWatermark: data.video?.noWatermark || "",
      watermark: data.video?.url || "",
      audio: data.music?.url || ""
    });
  } catch (err) {
    console.error("🔥 Lỗi API:", err.message);
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));


