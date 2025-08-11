document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("downloadForm");
    const videoURLInput = document.getElementById("videoURL");
    const message = document.getElementById("message");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const videoURL = videoURLInput.value.trim();

        if (!videoURL) {
            showMessage("❌ Vui lòng nhập link TikTok hợp lệ", "error");
            return;
        }

        showMessage("⏳ Đang xử lý, vui lòng chờ...", "loading");

        try {
            // 📌 Gửi link đến backend (bạn cần viết API /api/download)
            const res = await fetch(`/api/download?url=${encodeURIComponent(videoURL)}`);
            if (!res.ok) throw new Error("Lỗi kết nối server");

            const data = await res.json();
            if (!data.downloadUrl) throw new Error("Không lấy được link tải");

            // 📥 Tạo link ẩn và tải về
            const a = document.createElement("a");
            a.href = data.downloadUrl;
            a.setAttribute("download", "");
            document.body.appendChild(a);
            a.click();
            a.remove();

            showMessage("✅ Tải xuống thành công!", "success");
        } catch (err) {
            showMessage("❌ Lỗi: " + err.message, "error");
        }
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = type;
    }
});
