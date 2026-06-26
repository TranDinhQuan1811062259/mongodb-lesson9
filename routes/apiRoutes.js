const express = require('express');
const router = express.Router();

// Import các Controller chính
const customerController = require('../controllers/customerController');
const orderController = require('../controllers/orderController');

// ==========================================
// MIDDLEWARE XÁC THỰC TOKEN (LESSON 8)
// ==========================================
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Lấy chuỗi chuỗi chuỗi Token sau chữ "Bearer "
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Không tìm thấy Access Token! Bạn cần đăng nhập." });
    }

    jwt.verify(token, customerController.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Access Token đã hết hạn hoặc không hợp lệ!" });
        }
        req.user = user; // Đính kèm thông tin user đã giải mã vào req để controller xài
        next();
    });
};

// ==========================================
// ROUTES ĐĂNG KÝ / ĐĂNG NHẬP (CUSTOMER)
// ==========================================
router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.post('/refresh-token', customerController.refreshTokenHandler);

// Các route GET cũ của customer (nếu có)
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);

// ==========================================
// ROUTES ĐƠN HÀNG (ORDERS) - ĐÃ BẢO VỆ BẰNG TOKEN
// ==========================================
// Câu 7: POST /api/orders -> Tạo đơn hàng mới (Cần Token)
router.post('/orders', authenticateToken, orderController.createOrder);

// Câu 3: GET /api/users/:id/orders -> Xem đơn hàng chính chủ
router.get('/users/:id/orders', authenticateToken, orderController.getOrdersByCustomer);

// Câu 4: GET /api/orders/highvalue -> Đơn hàng giá trị cao
router.get('/orders/highvalue', authenticateToken, orderController.getHighValueOrders);

// Câu 8: PUT /api/orders/:id -> Cập nhật số lượng đơn hàng
router.put('/orders/:id', authenticateToken, orderController.updateOrderQuantity);

// DELETE /api/orders/:id -> Xóa đơn hàng
router.delete('/orders/:id', authenticateToken, orderController.deleteOrder);

// GET /api/orders -> Xem tất cả đơn hàng tổng quát
router.get('/orders', authenticateToken, orderController.getAllOrders);

module.exports = router;