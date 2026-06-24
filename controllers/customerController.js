const Customer = require('../models/customerModel');
const crypto = require('crypto');

// ==========================================
// CÂU 0: GET /customers/getApikey/:id
// ==========================================
const getApiKey = async (req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng để cấp API Key!" });
        }

        // Sinh chuỗi ngẫu nhiên dài 6 ký tự bằng crypto
        const randomString = crypto.randomBytes(3).toString('hex');

        // Tạo chuỗi apiKey theo đúng định dạng đề bài yêu cầu
        const apiKey = `web-$${customer.id}$-${customer.email}-${randomString}$`;

        // Lưu apiKey này vào database của khách hàng để sau này đối chiếu
        customer.apiKey = apiKey;
        await customer.save();

        res.status(200).json({ apiKey: apiKey });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 1: GET /customers
// ==========================================
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 2: GET /customers/:id
// ==========================================
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng yêu cầu!" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 6: POST /customers
// ==========================================
const createCustomer = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Sinh ngẫu nhiên ID không trùng lặp (ví dụ: c1a2b3c)
        const randomId = 'c' + crypto.randomBytes(3).toString('hex');

        const newCustomer = new Customer({
            id: randomId,
            name,
            email,
            age
        });

        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// KHỐI EXPORT DUY NHẤT Ở CUỐI FILE
// ==========================================
module.exports = {
    getApiKey,
    getAllCustomers,
    getCustomerById,
    createCustomer
};