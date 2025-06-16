const axios = require("axios");

const followRedirect = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, {
      maxRedirects: 5,
      timeout: 5000
    });
    return response.request?.res?.responseUrl || shortUrl;
  } catch (err) {
    console.warn("⚠️ Lỗi redirect:", err.message);
    return shortUrl;
  }
};

const handler = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  const finalUrl = await followRedirect(url);
  console.log("🔗 Link sau redirect:", finalUrl);

  try {
    const response = await axios.get("https://robotilab.xyz/api/tiktok", {
      params: { url: finalUrl }
    });

    const data = response.data;
    if (!data.downloadUrl) {
      return res.status(200).json({ code: 2, message: "❌ Không lấy được video", raw: data });
    }

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
    console.error("🔥 Lỗi API:", err.message);
    return res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

module.exports = handler;



