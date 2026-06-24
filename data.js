const mongoose = require('mongoose');
const Customer = require('./models/customerModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');
require('dotenv').config();

// ================= DỮ LIỆU MẪU CỦA BẠN =================
const customers = [
    { id: "c001", name: "Nguyễn Văn A", email: "nguyenvana@example.com", age: 28 },
    { id: "c002", name: "Trần Thị B", email: "tranthib@example.com", age: 32 },
    { id: "c003", name: "Lê Văn C", email: "levanc@example.com", age: 24 },
    { id: "c004", name: "Phạm Thị D", email: "phamthid@example.com", age: 29 },
    { id: "c005", name: "Hoàng Văn E", email: "hoangvane@example.com", age: 35 },
    { id: "c006", name: "Đỗ Thị F", email: "dothif@example.com", age: 27 },
    { id: "c007", name: "Vũ Văn G", email: "vuvang@example.com", age: 31 },
    { id: "c008", name: "Phan Thị H", email: "phanthih@example.com", age: 26 },
    { id: "c009", name: "Ngô Văn I", email: "ngovani@example.com", age: 33 },
    { id: "c010", name: "Đặng Thị K", email: "dangthik@example.com", age: 30 }
];

const products = [
    { id: "p001", name: "Điện thoại", price: 7000000, quantity: 100 },
    { id: "p002", name: "Laptop", price: 15000000, quantity: 50 },
    { id: "p003", name: "Máy tính bảng", price: 8000000, quantity: 80 },
    { id: "p004", name: "Tai nghe", price: 500000, quantity: 200 },
    { id: "p005", name: "Chuột không dây", price: 300000, quantity: 150 },
    { id: "p006", name: "Bàn phím cơ", price: 1200000, quantity: 60 },
    { id: "p007", name: "Màn hình", price: 4000000, quantity: 70 },
    { id: "p008", name: "Ổ cứng SSD", price: 2000000, quantity: 90 },
    { id: "p009", name: "Pin dự phòng", price: 600000, quantity: 110 },
    { id: "p010", name: "Loa Bluetooth", price: 1500000, quantity: 85 }
];

const orders = [
    { id: "o001", customerId: "c001", productId: "p002", quantity: 1, totalPrice: 15000000 },
    { id: "o002", customerId: "c003", productId: "p001", quantity: 2, totalPrice: 14000000 },
    { id: "o003", customerId: "c002", productId: "p005", quantity: 3, totalPrice: 900000 },
    { id: "o004", customerId: "c005", productId: "p004", quantity: 2, totalPrice: 1000000 },
    { id: "o005", customerId: "c004", productId: "p007", quantity: 1, totalPrice: 4000000 },
    { id: "o006", customerId: "c006", productId: "p003", quantity: 1, totalPrice: 8000000 },
    { id: "o007", customerId: "c008", productId: "p006", quantity: 2, totalPrice: 2400000 },
    { id: "o008", customerId: "c007", productId: "p009", quantity: 1, totalPrice: 600000 },
    { id: "o009", customerId: "c009", productId: "p008", quantity: 1, totalPrice: 2000000 },
    { id: "o010", customerId: "c010", productId: "p010", quantity: 1, totalPrice: 1500000 }
];
// =======================================================

const seedDB = async () => {
    try {
        // Kết nối tới MongoDB Local (sử dụng tên biến chuẩn của bạn)
        await mongoose.connect('mongodb://127.0.0.1:27017/mongodb_lesson6');
        console.log('Đã kết nối MongoDB để nạp dữ liệu...');

        // Xóa dữ liệu cũ nếu có để tránh trùng lặp khi chạy lại nhiều lần
        await Customer.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Nạp dữ liệu mới từ các mảng có sẵn ở phía trên của file
        await Customer.insertMany(customers);
        await Product.insertMany(products);
        await Order.insertMany(orders);

        console.log('🎉 Nạp dữ liệu mẫu từ data.js thành công tốt đẹp!');
        process.exit();
    } catch (error) {
        console.error('Lỗi nạp dữ liệu:', error);
        process.exit(1);
    }
};

seedDB();