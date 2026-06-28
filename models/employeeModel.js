const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);