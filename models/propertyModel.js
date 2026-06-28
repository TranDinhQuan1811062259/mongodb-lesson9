const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Sold', 'Deposit'], default: 'Available' },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

module.exports = mongoose.model('Property', propertySchema);