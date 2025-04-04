import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Booking from "../../models/Booking.js";
import PaymentMethod from "../../models/PaymentMethod.js";
import User from "../../models/User.js";

dotenv.config();

// Đăng ký người dùng
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: password_hash,
      firstName,
      lastName,
      phone,
      role: "user",
    });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ isAuthenticated: true, token, userDetails: user });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false, message: err.message });
  }
};

// Đăng xuất đơn giản
export const logoutUser = async (req, res) => {
  try {
    res.json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

// Lấy thông tin người dùng
export const authUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password_hash");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cập nhật hồ sơ người dùng
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Lấy danh sách đặt phòng
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy phương thức thanh toán
export const getPayments = async (req, res) => {
  try {
    const payments = await PaymentMethod.find({ user: req.user._id });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
