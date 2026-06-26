const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true }
});

// Middleware tự động mã hóa mật khẩu TRƯỚC KHI LƯU vào database
// Sửa đổi: Bỏ tham số 'next' vì sử dụng hàm async function, Mongoose sẽ tự động xử lý khi hoàn thành Promise
customerSchema.pre('save', async function () {
  const customer = this;

  // Chỉ mã hóa lại khi mật khẩu có sự thay đổi (hoặc khi tạo mới)
  if (!customer.isModified('password')) return;

  try {
    // Độ an toàn của chuỗi mã hóa (thường là 10 vòng băm)
    const salt = await bcrypt.genSalt(10);
    // Tiến hành băm mật khẩu
    customer.password = await bcrypt.hash(customer.password, salt);
  } catch (error) {
    throw error; // Ném lỗi trực tiếp để Mongoose bắt lấy
  }
});

// Hàm tiện ích: Dùng để so sánh mật khẩu lúc đăng nhập (Login) sau này
customerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);