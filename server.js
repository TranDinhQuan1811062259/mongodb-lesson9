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

// Import file định tuyến chính
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Khởi chạy kết nối Database
connectDB();

// Middleware xử lý JSON body dữ liệu đầu vào (bắt buộc để đọc được req.body khi POST/PUT)
app.use(express.json());

// Sử dụng toàn bộ route API với tiền tố /api chuẩn chỉnh
app.use('/api', apiRoutes);

// Cấu hình cổng Port chạy ứng dụng
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 Server đang chạy ổn định tại: http://localhost:${PORT}`);
  console.log(`📌 API lấy Key (Câu 0): http://localhost:${PORT}/api/customers/getApikey/c001`);
  console.log(`===========================================================`);
});