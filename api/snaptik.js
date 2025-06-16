const axios = require("axios");

const handler = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  try {
    const response = await axios.get("https://robotilab.xyz/api/tiktok", {
      params: { url }
    });

    const data = response.data;
    console.log("📦 API trả về:", data);

    if (!data.downloadUrl) {
      return res.status(200).json({ code: 2, message: "❌ Không lấy được video", raw: data });
    }

    // Gửi lại dữ liệu cho client
    return res.status(200).json({
      code: 0,
      data: [
        { url: data.downloadUrl, label: "Tải xuống không có logo" }
      ],
      meta: {
        thumbnail: data.cover,
        description: data.description,
        author: data.author?.nickname || data.author?.username
      }
    });
  } catch (err) {
    console.error("🔥 Lỗi gọi API:", err.message);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

module.exports = handler;


