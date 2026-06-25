const express = require('express');
const router = express.Router();

// Import các Controllers
const { 
    getAllCustomers, 
    getCustomerById, 
    createCustomer, 
    getApiKey, 
    register, 
    login 
} = require('../controllers/customerController');

const { getProductsByPrice } = require('../controllers/productController');

const { 
    getOrdersByCustomer, 
    getHighValueOrders, 
    createOrder, 
    updateOrderQuantity, 
    deleteOrder,
    // GIẢ ĐỊNH: Bổ sung thêm hàm lấy tất cả đơn hàng nếu controller của bạn có hỗ trợ
    getAllOrders 
} = require('../controllers/orderController');

// Import các Middlewares
const { 
    validateRegister, 
    validateLogin, 
    validateOrder, 
    checkApiKey 
} = require('../middlewares/authMiddleware');


// =========================================================================
// CÁC API PUBLIC (Không chặn checkApiKey)
// =========================================================================

// API lấy API Key cũ
router.get('/customers/getApikey/:id', getApiKey);

// NEW LESSON 7: API Đăng ký & Đăng nhập
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);


// =========================================================================
// CÁC API PHÍA DƯỚI ĐỀU ĐƯỢC BẢO VỆ BỞI MIDDLEWARE checkApiKey
// =========================================================================

// --- Routes Khách hàng ---
router.get('/customers', checkApiKey, getAllCustomers);
router.get('/customers/:id', checkApiKey, getCustomerById);
router.post('/customers', checkApiKey, validateRegister, createCustomer); 

// --- Routes Đơn hàng ---
// Chuẩn hóa: Thêm route này để sửa lỗi "Cannot GET /api/orders" lúc nãy bạn gặp
if (typeof getAllOrders === 'function') {
    router.get('/orders', checkApiKey, getAllOrders); 
}

router.get('/orders/highvalue', checkApiKey, getHighValueOrders);       // Lấy đơn hàng giá trị cao
router.get('/users/:id/orders', checkApiKey, getOrdersByCustomer);      // Yêu cầu 3: Lấy đơn hàng theo User ID
router.post('/orders', checkApiKey, validateOrder, createOrder);        // Yêu cầu 4: Tạo đơn hàng
router.put('/orders/:id', checkApiKey, updateOrderQuantity);          // Yêu cầu 5: Cập nhật số lượng
router.delete('/orders/:id', checkApiKey, deleteOrder);               // Yêu cầu 6: Xóa đơn hàng

// --- Routes Sản phẩm ---
router.get('/products', checkApiKey, getProductsByPrice);

module.exports = router;