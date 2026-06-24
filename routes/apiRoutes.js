const express = require('express');
const router = express.Router();

// Import các Controllers
const { getAllCustomers, getCustomerById, createCustomer, getApiKey } = require('../controllers/customerController');
const { getProductsByPrice } = require('../controllers/productController');
const { getOrdersByCustomer, getHighValueOrders, createOrder, updateOrderQuantity } = require('../controllers/orderController');

// Import các Middlewares
const { validateCustomer, validateOrder, checkApiKey } = require('../middlewares/authMiddleware');

// === CÂU 0: API LẤY API KEY (Không chặn checkApiKey ở đây) ===
router.get('/customers/getApikey/:id', getApiKey);

// =========================================================================
// CÁC API PHÍA DƯỚI ĐỀU ĐƯỢC BẢO VỆ BỞI MIDDLEWARE checkApiKey
// =========================================================================

// Routes Khách hàng (Câu 1, 2, 3, 6)
router.get('/customers', checkApiKey, getAllCustomers);
router.get('/customers/:id', checkApiKey, getCustomerById);
router.get('/customers/:customerId/orders', checkApiKey, getOrdersByCustomer);
router.post('/customers', checkApiKey, validateCustomer, createCustomer);

// Routes Đơn hàng (Câu 4, 7, 8)
router.get('/orders/highvalue', checkApiKey, getHighValueOrders);
router.post('/orders', checkApiKey, validateOrder, createOrder);
router.put('/orders/:orderId', checkApiKey, updateOrderQuantity);

// Routes Sản phẩm (Câu 5)
router.get('/products', checkApiKey, getProductsByPrice);

module.exports = router;