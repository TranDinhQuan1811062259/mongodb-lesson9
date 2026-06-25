const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const crypto = require('crypto');

// ==============================================================================
// Câu 3: GET /users/:id/orders -> Lấy danh sách đơn hàng của bản thân (Lesson 7 chỉnh sửa)
// ==============================================================================
const getOrdersByCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        // Yêu cầu Lesson 7: user chỉ xem được thông tin orders của bản thân mình
        if (id !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng của người khác!" });
        }

        const orders = await Order.find({ customerId: id });
        res.status(200).json(orders); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==============================================================================
// Câu 4: GET /orders/highvalue -> Giữ nguyên câu cũ của bạn
// ==============================================================================
const getHighValueOrders = async (req, res) => {
    try {
        const highValueOrders = await Order.find({ totalPrice: { $gt: 10000000 } });
        res.status(200).json(highValueOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==============================================================================
// Câu 7: POST /orders -> Tạo mới một đơn hàng (Lesson 7 chỉnh sửa tự động gán user)
// ==============================================================================
const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = req.productData; // Lấy sản phẩm đã tìm thấy từ middleware chuyển sang

        // Yêu cầu Lesson 7: khi tạo đơn hàng, mặc định sẽ là của người đang đăng nhập
        const customerId = req.user.id; 

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

// ==============================================================================
// Câu 8: PUT /orders/:id -> Cập nhật số lượng đơn hàng của bản thân (Lesson 7 chỉnh sửa)
// ==============================================================================
const updateOrderQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: "Số lượng cập nhật không hợp lệ!" });
        }

        // 1. Tìm đơn hàng cần cập nhật
        const order = await Order.findOne({ id: req.params.id });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng yêu cầu!" });
        }

        // Yêu cầu Lesson 7: User chỉ được cập nhật đơn hàng của bản thân
        if (order.customerId !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa đơn hàng của người khác!" });
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

        // 3. Cập nhật số lượng tồn kho của sản phẩm (giảm đi lượng tăng thêm hoặc cộng lại nếu giảm đặt)
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

// ==============================================================================
// NEW LESSON 7: DELETE /orders/:id -> Xóa đơn hàng chính chủ
// ==============================================================================
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ id: req.params.id });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng cần xóa!" });
        }

        // Yêu cầu Lesson 7: User chỉ được xoá đơn hàng của bản thân
        if (order.customerId !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa đơn hàng của người khác!" });
        }

        // Tìm lại sản phẩm để hoàn trả số lượng về kho trước khi hủy đơn (Tùy chọn tối ưu thêm)
        const product = await Product.findOne({ id: order.productId });
        if (product) {
            product.quantity += order.quantity;
            await product.save();
        }

        await Order.deleteOne({ id: req.params.id });
        res.status(200).json({ message: "Xóa đơn hàng thành công và đã hoàn trả số lượng về kho!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==============================================================================
// KHỐI EXPORT DUY NHẤT Ở CUỐI FILE (Cập nhật đầy đủ hàm mới)
// ==============================================================================
module.exports = {
    getOrdersByCustomer,
    getHighValueOrders,
    createOrder,
    updateOrderQuantity,
    deleteOrder // Hàm mới Lesson 7
};