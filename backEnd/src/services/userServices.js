import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (userData) => {
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) throw new Error("User already exists");
  
    // Hash password trước khi lưu vào database
    userData.password_hash = await bcrypt.hash(userData.password, 10);
    userData.fullName = `${userData.firstName} ${userData.lastName}`;
  
    return await userRepository.createUser(userData);
};

const login = async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Người dùng không tồn tại");
    if (!password || !user.password_hash) {
      throw new Error("Thiếu mật khẩu hoặc hash để kiểm tra!");
    }
    // So sánh mật khẩu với hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Mật khẩu không đúng!");
    // Tạo JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
    return token;
  };

const updateProfile = async (email, updateData) => {
  return await userRepository.updateUser(email, updateData);
};

const getAuthUser = async (userId) => {
  try {
      const user = await userRepository.findById(userId);
      return user;
  } catch (error) {
      console.error("🚨 Lỗi trong getAuthUser:", error);
      throw new Error("Lỗi khi lấy thông tin người dùng");
  }
};
export default { register, login, updateProfile, getAuthUser };
