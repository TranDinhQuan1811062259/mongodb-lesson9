const express = require('express');
const router = express.Router();

// Import các Controller
const authController = require('../controllers/authController');
const propertyController = require('../controllers/propertyController');
const customerController = require('../controllers/customerController');
const depositOrderController = require('../controllers/depositOrderController'); // Đã import

// Import Middleware
const { authenticateToken, authorize } = require('../middlewares/authMiddleware');

// ==========================================
// ROUTES AUTH (Đăng ký/Đăng nhập)
// ==========================================
router.post('/register', authController.register);
router.post('/login', authController.login);

// ==========================================
// ROUTES BẤT ĐỘNG SẢN (Property)
// ==========================================
// Xem danh sách: Ai cũng xem được
router.get('/properties', propertyController.getAllProperties);

// Đăng tin (Yêu cầu 8): Chỉ Admin hoặc Employee
router.post('/properties', 
    authenticateToken, 
    authorize(['Admin', 'Employee']), 
    propertyController.createProperty
);

// Cập nhật (Yêu cầu 13): Chỉ Admin hoặc Employee
router.put('/properties/:id', 
    authenticateToken, 
    authorize(['Admin', 'Employee']), 
    propertyController.updateProperty
);

// ==========================================
// ROUTES KHÁCH HÀNG & ĐƠN CỌC (DepositOrder)
// ==========================================
// Tạo đơn cọc (Yêu cầu 10): Chỉ Customer
router.post('/deposit-orders', 
    authenticateToken, 
    authorize(['Customer']), 
    depositOrderController.createDeposit
);

// Xem đơn của chính mình (Yêu cầu 11): Chỉ Customer
router.get('/customers/my-orders', 
    authenticateToken, 
    authorize(['Customer']), 
    depositOrderController.getMyOrders
);

module.exports = router;