// snaptik.js
const axios = require("axios");

const followRedirect = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, {
      maxRedirects: 5,
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0" // TikTok short links cần user-agent
      }
    });
    return response.request?.res?.responseUrl || shortUrl;
  } catch (err) {
    console.warn("⚠️ Lỗi redirect:", err.message);
    return shortUrl;
  }
};

const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  const finalUrl = await followRedirect(url);
  console.log("🔗 Final TikTok URL:", finalUrl);

  try {
    const response = await axios.get("https://tiktok-download-video1.p.rapidapi.com/getVideo", {
      params: {
        url: finalUrl,
        hd: '1'
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-download-video1.p.rapidapi.com"
      }
    });

    const data = response.data?.data || {};
    console.log("✅ API trả về:", data);

    const downloadUrl = data.hdplay || data.play || data.wmplay;

    if (!downloadUrl) {
      return res.status(200).json({
        code: 2,
        message: "❌ Không lấy được video",
        raw: data
      });
    }

    return res.status(200).json({
      code: 0,
      data: [{ url: downloadUrl, label: "Tải video" }],
      meta: {
        thumbnail: data.cover,
        description: data.title,
        author: data.author?.nickname || data.author?.unique_id || ""
      }
    });
  } catch (err) {
    console.error("🔥 Lỗi API:", err.message);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message
    });
  }
};

module.exports = handler;





