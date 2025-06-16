const axios = require("axios");

const followRedirect = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, { maxRedirects: 5 });
    return response.request.res.responseUrl || shortUrl;
  } catch (err) {
    console.warn("⚠️ Lỗi redirect:", err.message);
    return shortUrl;
  }
};

const handler = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  const finalUrl = await followRedirect(url);

  try {
    const response = await axios.get("https://tiktok-video-downloader-api.p.rapidapi.com/media", {
      params: { url: finalUrl },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com"
      }
    });

    const video = response.data?.video;

    if (!video?.no_watermark) {
      return res.status(200).json({ code: 2, message: "Không lấy được video", raw: video });
    }

    return res.status(200).json({
      code: 0,
      data: [
        { url: video.no_watermark, label: "Tải xuống không có hình mờ HD" },
        { url: video.watermark, label: "Tải xuống với hình mờ HD" },
        { url: video.music, label: "Tải nhạc" }
      ]
    });
  } catch (err) {
    console.error("🔥 Lỗi API:", err.message);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

module.exports = handler;


