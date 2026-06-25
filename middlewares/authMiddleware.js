const Customer = require('../models/customerModel');
const Product = require('../models/productModel');

// 1. Kiểm tra apiKey trên query và lưu thông tin user đang đăng nhập
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
        
        // LƯU Ý: Gắn thông tin customer đăng nhập vào request để các API phía sau sử dụng
        req.user = customer; 
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Kiểm tra thông tin đăng ký bắt buộc phải có password cho Lesson 7
const validateRegister = async (req, res, next) => {
    try {
        const { name, email, age, password } = req.body;
        if (!name || !email || !age || !password) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc: name, email, age, hoặc password!" });
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

// 3. Kiểm tra thông tin đăng nhập (Yêu cầu mới Lesson 7)
const validateLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin: email và password!" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Giữ nguyên logic kiểm tra Order cũ của bạn
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
    validateRegister,
    validateLogin,
    validateOrder
};