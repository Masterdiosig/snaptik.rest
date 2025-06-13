const res = await fetch('http://localhost:3000/api/snaptik', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: "https://www.tiktok.com/@user/video/xyz" })
});
const data = await res.json();
if (data.code === 0) {
  console.log("Các link tải:", data.data); // bạn có thể lấy link đầu tiên để tải
} else {
  alert(data.msg);
}
