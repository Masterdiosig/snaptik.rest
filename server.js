// snaptik.js
const dotenv = require("dotenv");
dotenv.config();

const fetch = require("node-fetch"); // nếu bạn chạy local cần import
const followRedirect = async (shortUrl) => {
  try {
    const response = await fetch(shortUrl, { method: "GET", redirect: "follow" });
    return response.url;
  } catch {
    return shortUrl;
  }
};

const handler = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  try {
    const finalUrl = await followRedirect(url);

    const apiRes = await fetch("https://tiktok-video-no-watermark10.p.rapidapi.com/media-info/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-video-no-watermark10.p.rapidapi.com"
      },
      body: JSON.stringify({ url: finalUrl })
    });

    const data = await apiRes.json();
    console.log("Kết quả từ RapidAPI:", data);

    if (data?.data?.play) {
      res.status(200).json({
        code: 0,
        data: [{ url: data.data.play, label: "Tải video" }]
      });
    } else {
      res.status(200).json({ code: 2, message: "Không lấy được video", raw: data });
    }
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
};

module.exports = handler;

