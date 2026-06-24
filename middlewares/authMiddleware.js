const Customer = require('../models/customerModel');
const Product = require('../models/productModel');

// 1. Định nghĩa các hàm trước
const checkApiKey = async (req, res, next) => {
    try {
        const { apiKey } = req.query;
        if (!apiKey) {
            return res.status(401).json({ message: "Truy cập bị từ chối! Thiếu apiKey trên URL." });
        }
        const customer = await Customer.findOne({ apiKey: apiKey });
        if (!customer) {
            return res.status(403).json({ message: "apiKey không hợp lệ hoặc đã hết hạn!" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateCustomer = async (req, res, next) => {
    try {
        const { name, email, age } = req.body;
        if (!name || !email || !age) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc: name, email, hoặc age!" });
        }
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email đã tồn tại, vui lòng dùng email khác!" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateOrder = async (req, res, next) => {
    try {
        const { customerId, productId, quantity } = req.body;
        if (!customerId || !productId || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc: customerId, productId, hoặc quantity!" });
        }
        if (quantity <= 0) {
            return res.status(400).json({ message: "Số lượng đặt hàng phải lớn hơn 0!" });
        }
        const product = await Product.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong hệ thống!" });
        }
        if (quantity > product.quantity) {
            return res.status(400).json({ message: `Số lượng sản phẩm trong kho không đủ! (Hiện còn: ${product.quantity})` });
        }
        req.productData = product;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. KHỐI EXPORT PHẢI ĐẶT Ở ĐÂY (CUỐI FILE)
module.exports = {
    checkApiKey,
    validateCustomer,
    validateOrder
};