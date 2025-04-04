import Booking from "../../models/Booking.js";

/**
 * Tạo booking mới
 */
export const createBooking = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      userId: req.user._id, // Gán user đang đăng nhập
      createdAt: new Date(),
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Đặt phòng thành công!",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Lỗi khi tạo booking:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi tạo booking!",
    });
  }
};

/**
 * Lấy danh sách booking của user hiện tại
 */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }) // Lấy booking của user hiện tại
      .populate("hotelCode", "name") // Lấy thông tin khách sạn
      .populate("paymentMethodId", "name") // Lấy phương thức thanh toán
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(200).json({
        success: true,
        message: "Bạn chưa có booking nào!",
        bookings: [],
      });
    }

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Lỗi lấy danh sách booking:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy danh sách booking!",
    });
  }
};

/**
 * Lấy tất cả booking (Chỉ admin)
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstName lastName email") // Thêm thông tin user
      .populate("hotelCode", "name") // Thêm thông tin khách sạn
      .populate("paymentMethodId", "name") // Thêm thông tin phương thức thanh toán
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Lỗi lấy tất cả booking:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ khi lấy danh sách booking!",
    });
  }
};
