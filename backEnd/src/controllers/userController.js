import userServices from "../services/userServices.js";
import dotenv from "dotenv";

dotenv.config();
export const register = async (req, res) => {
  try {
    const user = await userServices.register(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const token = await userServices.login(req.body.email, req.body.password);
    res.json({ success: true, token });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};
// Lấy thông tin user từ token
export const authUser = async (req, res) => {
  try {
      // Lấy user từ services bằng ObjectId từ MongoDB (_id)
      const user = await userServices.getAuthUser(req.user._id);
      console.log("🔹 Check function userService in userController:", user);

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
  } catch (error) {
      console.error("🚨 Lỗi trong authUser:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Đăng xuất người dùng
export const logoutUser = async (req, res) => {
    try {
        res.json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error controller" });
    }
};

// ✅ Cập nhật hồ sơ người dùng
export const updateProfile = async (req, res) => {
    try {
        const updatedUser = await userServices.updateUserProfile(req.user._id, req.body);
        res.json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ Lấy danh sách đặt phòng của một người dùng
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await userServices.getUserBookings(req.user._id);

    // Map dữ liệu để trả về đúng format yêu cầu
    const formattedBookings = bookings.map(booking => ({
      bookingId: booking._id,
      hotelId: booking.hotelId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      rooms: booking.rooms,
      roomType: booking.roomType,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
      paymentMethod: {
        cardType: booking.paymentMethodId.cardType,
        cardNumber: booking.paymentMethodId.cardNumber,
        expiryDate: booking.paymentMethodId.expiryDate,
        nameOnCard: booking.paymentMethodId.nameOnCard
      }
    }));

    res.json({
      success: true,
      data: {
        elements: formattedBookings
      }
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Có lỗi xảy ra khi lấy danh sách đặt phòng" 
    });
  }
};

// ✅ Lấy phương thức thanh toán của người dùng
export const getPayments = async (req, res) => {
  try {
    const payments = await userServices.getUserPayments(req.user._id);
    const formattedPayments = payments.map(payment => ({
      paymentId: payment._id,
      cardType: payment.cardType,
      cardNumber: payment.cardNumber,
      expiryDate: payment.expiryDate,
      nameOnCard: payment.nameOnCard,
      billingAddress: payment.billingAddress,
      isDefault: payment.isDefault
    }));

    res.json({
      success: true,
      data: {
        elements: formattedPayments
      }
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Có lỗi xảy ra khi lấy danh sách phương thức thanh toán" 
    });
  }
};