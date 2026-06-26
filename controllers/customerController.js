const Customer = require('../models/customerModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Thư viện Token của Lesson 8

// Khai báo mã bí mật tạm thời phục vụ ký mã độc quyền cho Token
const ACCESS_TOKEN_SECRET = 'access_secret_key_lesson_8_quan_anthony';
const REFRESH_TOKEN_SECRET = 'refresh_secret_key_lesson_8_quan_anthony';

// Mảng tạm thời lưu trữ các refreshToken hợp lệ để đối chiếu (Yêu cầu đề bài)
let refreshTokens = [];

// ==========================================
// CÂU 1: POST /register (Đăng ký tài khoản - Lesson 8)
// ==========================================
const register = async (req, res) => {
    try {
        const { name, email, age, password } = req.body;
        
        // Sinh ngẫu nhiên ID không trùng lặp
        const randomId = 'c' + crypto.randomBytes(3).toString('hex');

        // Khởi tạo đối tượng (Model đã được sửa, tự động băm mật khẩu chuẩn async/await)
        const newCustomer = new Customer({
            id: randomId,
            name,
            email,
            age,
            password 
        });

        await newCustomer.save();

        // Ẩn mật khẩu khi phản hồi về client
        const userResponse = newCustomer.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 2: POST /login (Đăng nhập - Trả về Access Token & Refresh Token)
// ==========================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm khách hàng theo email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        // Sử dụng hàm comparePassword tiện ích tụi mình đã viết bên Model
        const isMatch = await customer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }

        // Tạo dữ liệu payload đính kèm bên trong token
        const userPayload = { id: customer.id, email: customer.email };

        // 1. Tạo Access Token (Có thời hạn ngắn - ví dụ: 15m)
        const accessToken = jwt.sign(userPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // 2. Tạo Refresh Token (Có thời hạn dài - ví dụ: 7d)
        const refreshToken = jwt.sign(userPayload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Lưu refresh token vào mảng tạm thời để quản lý
        refreshTokens.push(refreshToken);

        res.status(200).json({
            message: "Đăng nhập thành công!",
            access_token: accessToken,
            refresh_token: refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÂU 7: POST /refresh-token (Cấp lại access_token mới)
// ==========================================
const refreshTokenHandler = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(401).json({ message: "Không tìm thấy Refresh Token!" });
        }

        // Kiểm tra xem token này có nằm trong danh sách được hệ thống cấp phép không
        if (!refreshTokens.includes(refresh_token)) {
            return res.status(403).json({ message: "Refresh Token không hợp lệ hoặc đã bị vô hiệu hóa!" });
        }

        // Xác thực chữ ký của Refresh Token
        jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Refresh Token đã hết hạn hoặc không trùng khớp!" });
            }

            // Ký một Access Token mới toanh dựa trên thông tin user cũ
            const newAccessToken = jwt.sign(
                { id: user.id, email: user.email }, 
                ACCESS_TOKEN_SECRET, 
                { expiresIn: '15m' }
            );

            res.status(200).json({
                access_token: newAccessToken
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// CÁC HÀM GET CŨ (Giữ lại nếu bạn cần dùng)
// ==========================================
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng!" });
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm bổ sung tạm thời giữ cấu trúc tương thích route cũ, tránh lỗi cache
const createCustomer = (req, res) => {
    res.status(400).json({ message: "Vui lòng sử dụng API /register để đăng ký tài khoản mới." });
};

// ==========================================
// KHỐI EXPORT ĐẦY ĐỦ VÀ AN TOÀN CHO LESSON 8
// ==========================================
module.exports = {
    register,
    login,
    refreshTokenHandler, 
    getAllCustomers,
    getCustomerById,
    createCustomer,
    ACCESS_TOKEN_SECRET
};