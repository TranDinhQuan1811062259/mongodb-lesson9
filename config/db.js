require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
// Sửa dòng 6 lại thành thế này:
await mongoose.connect(process.env.MONGO_URI);    console.log('Kết nối MongoDB thành công!');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;