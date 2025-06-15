const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const followRedirect = async (shortUrl) => {
  try {
    const response = await axios.get(shortUrl, { maxRedirects: 5 });
    return response.request.res.responseUrl || shortUrl;
  } catch (err) {
    console.warn("Lỗi follow redirect:", err.message);
    return shortUrl;
  }
};

const handler = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ code: 1, message: "Thiếu URL" });

  try {
    const finalUrl = await followRedirect(url);

    const options = {
      method: "POST",
      url: "https://tiktok-video-no-watermark10.p.rapidapi.com/media-info/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-video-no-watermark10.p.rapidapi.com"
      },
      data: { url: finalUrl }
    };

    const apiRes = await axios.request(options);
    const data = apiRes.data;
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
    console.error("Lỗi gọi RapidAPI:", err.message);
    res.status(500).json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

module.exports = handler;


