const Account = require('../models/accountModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import thư viện JWT

// 1. Đăng ký tài khoản (Register)
exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAccount = new Account({
            email,
            password: hashedPassword,
            role: role || 'Customer',
            isActive: true
        });

        await newAccount.save();
        res.status(201).json({ message: "Đăng ký thành công!", accountId: newAccount._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. Đăng nhập (Login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const account = await Account.findOne({ email });

        if (!account || !account.isActive) {
            return res.status(401).json({ message: "Tài khoản không tồn tại hoặc đã bị khóa!" });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai mật khẩu!" });
        }

        // TẠO TOKEN JWT
        // Đính kèm ID và Role để middleware có thể kiểm tra quyền sau này
        const token = jwt.sign(
            { id: account._id, role: account.role }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1h' } // Token có thời hạn 1 giờ
        );

        res.status(200).json({ 
            message: "Đăng nhập thành công!", 
            token: token, // Gửi token về cho client
            role: account.role, 
            accountId: account._id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};