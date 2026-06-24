const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Order', orderSchema);