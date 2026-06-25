const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true }, // Thêm trường password bắt buộc cho Lesson 7
  apiKey: { type: String }
});

module.exports = mongoose.model('Customer', customerSchema);