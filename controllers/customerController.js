const Customer = require('../models/customerModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt'); // Import thư viện mã hóa mật khẩu cho Lesson 7

// ==========================================
// CÂU 0: GET /customers/getApikey/:id (Cũ của bạn)
// ==========================================
const getApiKey = async (req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng để cấp API Key!" });
        }

        const randomString = crypto.randomBytes(3).toString('hex');
        const apiKey = `web-$${customer.id}$-${customer.email}-${randomString}$`;

        customer.apiKey = apiKey;
        await customer.save();

        res.status(200).json({ apiKey: apiKey });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 1: GET /customers (Cũ của bạn)
// ==========================================
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 2: GET /customers/:id (Cũ của bạn)
// ==========================================
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy khách hàng yêu cầu!" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 6: POST /customers (Cũ của bạn)
// ==========================================
const createCustomer = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const randomId = 'c' + crypto.randomBytes(3).toString('hex');

        const newCustomer = new Customer({
            id: randomId,
            name,
            email,
            age
        });

        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// NEW LESSON 7: POST /register (API Đăng ký tài khoản)
// ==========================================
const register = async (req, res) => {
    try {
        const { name, email, age, password } = req.body;
        
        // Sinh ngẫu nhiên ID không trùng lặp giống hàm cũ của bạn
        const randomId = 'c' + crypto.randomBytes(3).toString('hex');

        // Mã hoá mật khẩu bằng bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = new Customer({
            id: randomId,
            name,
            email,
            age,
            password: hashedPassword
        });

        await newCustomer.save();

        // Ẩn mật khẩu khi phản hồi về client cho bảo mật
        const userResponse = newCustomer.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// NEW LESSON 7: POST /login (API Đăng nhập trả về apiKey mới)
// ==========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        // Kiểm tra xem mật khẩu nhập vào có khớp với mật khẩu mã hóa trong DB không
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        // Sinh chuỗi ngẫu nhiên để xác thực apiKey
        const randomString = crypto.randomBytes(4).toString('hex');

        // Khớp định dạng đề bài: web-${userId}-${email}-${randomString}$
        // Mình dùng customer.id chuỗi ngẫu nhiên của bạn luôn nhé
        const apiKey = `web-$${customer.id}$-${customer.email}-${randomString}$`;

        // Lưu apiKey này vào database của khách hàng để sau này đối chiếu
        customer.apiKey = apiKey;
        await customer.save();

        res.status(200).json({ apiKey: apiKey });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// KHỐI EXPORT DUY NHẤT Ở CUỐI FILE (Cập nhật đầy đủ hàm mới)
// ==========================================
module.exports = {
    getApiKey,
    getAllCustomers,
    getCustomerById,
    createCustomer,
    register, // Hàm mới Lesson 7
    login     // Hàm mới Lesson 7
};