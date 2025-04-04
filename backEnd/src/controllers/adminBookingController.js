import * as bookingService from "../services/adminBookingService.js";

export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy booking" });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

export const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingService.createBooking(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Đặt phòng thành công!",
        booking: newBooking,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const updatedBooking = await bookingService.cancelBooking(req.params.id);
    res.json({
      success: true,
      message: "Booking đã bị hủy",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
