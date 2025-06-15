const axios = require("axios");

const handler = async (req, res) => {
  console.log("📥 Gọi API snaptik mới");
  console.log("🔑 RAPIDAPI_KEY:", process.env.RAPIDAPI_KEY || "⛔ Không tồn tại");

  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  try {
    const response = await axios.get("https://tiktok-video-downloader-api.p.rapidapi.com/media", {
      params: { videoUrl: url },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-video-downloader-api.p.rapidapi.com"
      }
    });

    const data = response.data;
    console.log("✅ Dữ liệu trả về:", data);

    const downloadUrl = data?.downloadUrl;

    if (downloadUrl) {
      return res.status(200).json({
        code: 0,
        data: [{ url: downloadUrl, label: "Tải video" }]
      });
    } else {
      return res.status(200).json({
        code: 2,
        message: "❌ Không lấy được video",
        raw: data
      });
    }
  } catch (err) {
    console.error("🔥 Lỗi gọi RapidAPI:", err.message);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message
    });
  }
};

module.exports = handler;


