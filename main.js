// main.js: JavaScript xử lý tương tác chính
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const input = document.querySelector('#url');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const url = input.value.trim();
    if (!url) {
      alert("Vui lòng dán link video TikTok.");
      return;
    }
    alert("Đang xử lý video từ: " + url);
    // Ở đây bạn có thể thêm fetch API thực sự hoặc gọi backend Node.js của bạn
  });
});
