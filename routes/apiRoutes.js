const express = require('express');
const router = express.Router();

// Import các Controller
const authController = require('../controllers/authController');
const propertyController = require('../controllers/propertyController');
const customerController = require('../controllers/customerController');
const depositOrderController = require('../controllers/depositOrderController');

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

// Đăng tin: Chỉ Manager hoặc Employee
router.post('/properties', 
    authenticateToken, 
    authorize(['Manager', 'Employee']), // Cập nhật theo role trong Account
    propertyController.createProperty
);

// Cập nhật: Chỉ Manager hoặc Employee
router.put('/properties/:id', 
    authenticateToken, 
    authorize(['Manager', 'Employee']), 
    propertyController.updateProperty
);

// ==========================================
// ROUTES ĐƠN CỌC (DepositOrders)
// ==========================================
// Tạo đơn cọc: Chỉ Customer
router.post('/deposit-orders', 
    authenticateToken, 
    authorize(['Customer']), 
    depositOrderController.createDeposit
);

// Xem đơn của chính mình: Chỉ Customer
router.get('/customers/my-orders', 
    authenticateToken, 
    authorize(['Customer']), 
    depositOrderController.getMyOrders
);

module.exports = router;