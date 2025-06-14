export default async function handler(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ code: 1, message: "Thiếu URL" });
  }

  try {
    // Bước 1: nếu là link rút gọn, theo dõi chuyển hướng để lấy full link
    const finalUrl = await resolveRedirect(url);

    const apiRes = await fetch("https://tiktok-download-video-without-watermark.p.rapidapi.com/analysis", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "tiktok-download-video-without-watermark.p.rapidapi.com"
      },
      body: JSON.stringify({ url: finalUrl })
    });

    const data = await apiRes.json();

    console.log("Phản hồi từ RapidAPI:", data);

    if (data.code === 0 && data.data?.play) {
      res.status(200).json({
        code: 0,
        data: [{ url: data.data.play, label: "Tải video" }]
      });
    } else {
      res.status(200).json({ code: 2, message: "Không lấy được video.", raw: data });
    }
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
}

// Hàm theo dõi redirect
async function resolveRedirect(shortUrl) {
  const res = await fetch(shortUrl, {
    method: "GET",
    redirect: "follow"
  });
  return res.url;
}

