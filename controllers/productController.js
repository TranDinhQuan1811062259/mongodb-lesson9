const Product = require('../models/productModel');

// Câu 5: GET /products?minPrice=?&maxPrice=? -> Lọc danh sách sản phẩm theo khoảng giá
const getProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        let filter = {};

        // Nếu có truyền minPrice hoặc maxPrice, gán vào query filter của Mongoose
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice); // Lớn hơn hoặc bằng minPrice
            if (maxPrice) filter.price.$lte = Number(maxPrice); // Nhỏ hơn hoặc bằng maxPrice
        }

        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductsByPrice
};