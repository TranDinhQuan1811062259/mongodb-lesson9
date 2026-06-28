const Property = require('../models/propertyModel');

// 1. Tạo bất động sản mới (Yêu cầu 8)
exports.createProperty = async (req, res) => {
    try {
        const { name, description, price, employeeId } = req.body;
        
        // Kiểm tra quyền: Chỉ Employee hoặc Admin mới được tạo
        if (req.user.role !== 'Employee' && req.user.role !== 'Admin') {
            return res.status(403).json({ message: "Bạn không có quyền đăng tin bất động sản!" });
        }

        const newProperty = new Property({
            name,
            description,
            price,
            employeeId: employeeId || req.user.id // Nếu không truyền thì lấy ID nhân viên đang đăng nhập
        });

        await newProperty.save();
        res.status(201).json({ message: "Đăng tin bất động sản thành công!", property: newProperty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. Lấy danh sách tất cả bất động sản (Yêu cầu 9)
exports.getAllProperties = async (req, res) => {
    try {
        // Sử dụng .populate() để lấy thông tin chi tiết nhân viên đăng tin
        const properties = await Property.find().populate('employeeId', 'name phone');
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Cập nhật thông tin bất động sản (Yêu cầu 13)
exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedProperty) {
            return res.status(404).json({ message: "Không tìm thấy bất động sản!" });
        }

        res.status(200).json({ message: "Cập nhật thành công!", property: updatedProperty });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};