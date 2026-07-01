// controllers/depositOrderController.js
const DepositOrder = require('../models/orderModel'); 

exports.createDeposit = async (req, res) => {
    try {
        // Lấy dữ liệu từ body (đảm bảo body gửi lên có tên trường là 'amount')
        const { propertyId, amount } = req.body;
        
        // Lấy customerId từ thông tin user đã được xác thực qua middleware
        const customerId = req.user.id; 

        // Tạo instance mới của DepositOrder, khớp tên trường với orderModel.js
        const newOrder = new DepositOrder({
            customerId,
            propertyId,
            amount: amount, // Đã sửa lại từ depositAmount thành amount
            status: 'Pending'
        });

        await newOrder.save();
        res.status(201).json({ message: "Đặt cọc thành công!", order: newOrder });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        // Tìm các đơn đặt cọc của người dùng hiện tại
        const orders = await DepositOrder.find({ customerId: req.user.id })
                                         .populate('customerId')
                                         .populate('propertyId');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};