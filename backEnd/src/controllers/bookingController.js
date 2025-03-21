import bookingService  from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking({
      ...req.body,
      user: req.user._id,
      bookingDate: new Date(),
    });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}; 