import Booking from "../models/Booking.js";

class BookingRepository {
  async createBooking(bookingData) {
    try {
      const booking = new Booking(bookingData);
      return await booking.save();
    } catch (error) {
      console.error('Create booking repository error:', error);
      throw error;
    }
  }

  async getUserBookings(userId) {
    try {
      return await Booking.find({ userId })
        .populate('paymentMethodId')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      console.error('Get user bookings repository error:', error);
      throw error;
    }
  }
}

export default new BookingRepository();