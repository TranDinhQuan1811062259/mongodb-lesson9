const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const crypto = require('crypto');

// Câu 3: GET /customers/:customerId/orders -> Lấy danh sách đơn hàng của một khách hàng cụ thể
const getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.customerId });
        res.status(200).json(orders); // Tự động trả về mảng rỗng [] nếu không tìm thấy đơn nào
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Câu 4: GET /orders/highvalue -> Lấy các đơn hàng có tổng giá trị > 10 triệu
const getHighValueOrders = async (req, res) => {
    try {
        const highValueOrders = await Order.find({ totalPrice: { $gt: 10000000 } });
        res.status(200).json(highValueOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Câu 7: POST /orders -> Tạo mới một đơn hàng (đã kiểm tra kho ở middleware)
const createOrder = async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;
        const product = req.productData; // Lấy sản phẩm đã tìm thấy từ middleware chuyển sang

        // Tính toán tổng tiền dựa trên giá của sản phẩm và số lượng đặt
        const totalPrice = product.price * quantity;
        const randomOrderId = 'o' + crypto.randomBytes(3).toString('hex');

        const newOrder = new Order({
            id: randomOrderId,
            customerId,
            productId,
            quantity,
            totalPrice
        });

        // 1. Lưu hóa đơn đơn hàng mới vào DB
        await newOrder.save();

        // 2. Giảm số lượng tồn kho của sản phẩm đi tương ứng
        product.quantity -= quantity;
        await product.save();

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Câu 8: PUT /orders/:orderId -> Cập nhật số lượng sản phẩm trong đơn hàng và tính lại tiền
const updateOrderQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Số lượng cập nhật không hợp lệ!" });
        }

        // 1. Tìm đơn hàng cần cập nhật
        const order = await Order.findOne({ id: req.params.orderId });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng yêu cầu!" });
        }

        // 2. Tìm sản phẩm liên quan để lấy giá tính lại và check kho
        const product = await Product.findOne({ id: order.productId });
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm của đơn hàng này không tồn tại trong kho!" });
        }

        // Tính toán sự chênh lệch số lượng (Số lượng mới - Số lượng cũ trong đơn)
        const quantityDifference = quantity - order.quantity;

        // Nếu tăng số lượng đặt mua, check xem kho còn đủ hàng để lấy thêm không
        if (quantityDifference > product.quantity) {
            return res.status(400).json({ 
                message: `Kho không đủ hàng để tăng số lượng! (Kho hiện tại còn: ${product.quantity})` 
            });
        }

        // 3. Cập nhật số lượng tồn kho của sản phẩm
        product.quantity -= quantityDifference;
        await product.save();

        // 4. Cập nhật số lượng và tính lại tổng tiền cho đơn hàng
        order.quantity = quantity;
        order.totalPrice = product.price * quantity;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrdersByCustomer,
    getHighValueOrders,
    createOrder,
    updateOrderQuantity
};