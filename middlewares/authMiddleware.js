const jwt = require('jsonwebtoken');
const Product = require('../models/productModel');
// Import mã bí mật từ controller để đối chiếu token
const { ACCESS_TOKEN_SECRET } = require('../controllers/customerController');

// 1. THAY THẾ CHÍNH: Xác thực JWT Token thay cho apiKey cũ
const authenticateToken = async (req, res, next) => {
    try {
        // Token thường được gửi trong header dưới dạng: Bearer <chuỗi_token>
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Truy cập bị từ chối! Thiếu Access Token trong Header." });
        }

        // Xác thực tính hợp pháp và thời hạn của token
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ message: "Access Token không hợp lệ hoặc đã hết hạn!" });
            }
            
            // Gắn thông tin giải mã (id, email) vào req.user để các API sau sử dụng
            req.user = decodedUser; 
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Kiểm tra thông tin đăng ký bắt buộc (Giữ nguyên từ bài cũ)
const validateRegister = async (req, res, next) => {
    try {
        const { name, email, age, password } = req.body;
        if (!name || !email || !age || !password) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc: name, email, age, hoặc password!" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Kiểm tra thông tin đăng nhập (Giữ nguyên từ bài cũ)
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

// 4. Cập nhật logic kiểm tra đơn hàng (Bỏ bắt buộc customerId ở body vì lấy từ token)
const validateOrder = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        
        // Lesson 8: customerId lấy tự động từ người đăng nhập, ko bắt buộc client gửi lên nữa
        if (!productId || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc: productId, hoặc quantity!" });
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

module.exports = {
    authenticateToken, // Đã đổi tên từ checkApiKey
    validateRegister,
    validateLogin,
    validateOrder
};