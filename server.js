require('dotenv').config();
const express = require('express');

// Hàm khởi chạy kết nối Database độc lập
const connectDB = async () => {
  try {
    const db = require('./config/db');
    await db();
    console.log("MongoDB đã kết nối thành công từ server.js!");
  } catch (error) {
    console.error("Lỗi kết nối database tại server.js:", error.message);
  }
};

// Import file định tuyến chính (Sẽ quản lý toàn bộ 15 yêu cầu của đề bài)
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Khởi chạy kết nối Database
connectDB();

// Middleware xử lý JSON body (bắt buộc để nhận dữ liệu từ Postman)
app.use(express.json());

// Sử dụng toàn bộ route API với tiền tố /api
app.use('/api', apiRoutes);

// Cấu hình cổng Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 Server Real Estate đang chạy tại: http://localhost:${PORT}`);
  console.log(`📌 Sẵn sàng xử lý 15 yêu cầu API từ đề bài.`);
  console.log(`===========================================================`);
});