import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';

const authMiddleware = async (req, res, next) => {
  try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
          return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("✅ Token decoded:", decoded);

      // Sử dụng ObjectId từ decoded.id để tìm user trong database
      const user = await userRepository.findById(decoded.id);
      // console.log("🔹 Check User:", user);  

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      req.user = user;
      next();
  } catch (error) {
      console.error("🚨 Lỗi trong authUser Middleware :", error);
      res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
