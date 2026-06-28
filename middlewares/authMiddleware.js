const jwt = require('jsonwebtoken');

// 1. Xác thực Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Truy cập bị từ chối! Thiếu Access Token." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: "Access Token không hợp lệ hoặc đã hết hạn!" });
        }
        
        // Gắn thông tin người dùng vào req
        req.user = decodedUser; 
        next();
    });
};

// 2. Middleware kiểm tra quyền
const authorize = (roles = []) => {
    return (req, res, next) => {
        // Kiểm tra an toàn: Đảm bảo req.user đã tồn tại sau khi qua authenticateToken
        if (!req.user) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để thực hiện hành động này!" });
        }

        // Kiểm tra xem role của user hiện tại có nằm trong danh sách được phép không
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
        }
        
        next();
    };
};

module.exports = {
    authenticateToken,
    authorize
};