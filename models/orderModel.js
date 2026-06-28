const mongoose = require('mongoose');

const depositOrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    depositDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Success', 'Cancel'], default: 'Pending' }
});

module.exports = mongoose.model('DepositOrder', depositOrderSchema);