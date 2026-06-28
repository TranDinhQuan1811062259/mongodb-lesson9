const Order = require('../models/orderModel'); // Giả sử bạn dùng orderModel

exports.createDeposit = async (req, res) => {
    try {
        const { propertyId, amount } = req.body;
        const customerId = req.user.id; // Lấy từ token đã xác thực

        const newOrder = new Order({
            customerId,
            propertyId,
            amount,
            status: 'Pending' // Trạng thái mặc định khi mới đặt cọc
        });

        await newOrder.save();
        res.status(201).json({ message: "Đặt cọc thành công!", order: newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};