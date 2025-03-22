import User from '../models/User.js';
import mongoose from 'mongoose';

// Tìm user theo email
const findByEmail = (email) => User.findOne({ email });

// Tạo user mới
const createUser = (userData) => User.create(userData);

// Cập nhật user theo email
const updateUser = (email, updateData) => 
    User.findOneAndUpdate({ email }, updateData, { new: true });

// Tìm theo _id (MongoDB mặc định sử dụng ObjectId)
const findById = async (userId) => {
    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const user = await User.findById(objectId).select("-password_hash"); // Không trả về password
        return user;
    } catch (error) {
        // console.error("🚨 Lỗi trong findById userRepository:", error);
        return null;
    }
};

// Xóa user theo ID
const deleteUser = (id) => User.findOneAndDelete({ id });

// 🔹 Tìm theo UUID
const findByUUID = async (uuid) => {
    console.log("🔍 Đang tìm user với id:", uuid);
    return await User.findOne({ id: uuid });
};

export default { findByEmail, createUser, updateUser ,findById, deleteUser, findByUUID };
