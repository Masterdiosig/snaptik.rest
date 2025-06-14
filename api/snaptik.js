export default async function handler(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ code: 1, message: "Thiếu URL" });
  }

  try {
    const apiRes = await fetch("https://tiktok-download-video-without-watermark.p.rapidapi.com/analysis", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-download-video-without-watermark.p.rapidapi.com"
      },
      body: JSON.stringify({ url })
    });

    const data = await apiRes.json();

    if (data.code === 0 && data.data && data.data.play) {
      res.status(200).json({
        code: 0,
        data: [
          {
            url: data.data.play,
            label: "Tải Video"
          }
        ]
      });
    } else {
      res.status(200).json({ code: 2, message: "Không lấy được video." });
    }
  } catch (err) {
    console.error("Lỗi khi gọi RapidAPI:", err);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
}
