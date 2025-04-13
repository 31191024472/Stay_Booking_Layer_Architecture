import bookingRepository from "../repositories/bookingRepository.js";

class BookingService {
  async createBooking(bookingData) {
    try {
      const booking = await bookingRepository.createBooking(bookingData);
      return booking;
    } catch (error) {
      console.error('Create booking service error:', error);
      throw new Error('Không thể tạo đặt phòng: ' + error.message);
    }
  }

  async getUserBookings(userId) {
    try {
      if (!userId) {
        throw new Error('UserId không hợp lệ');
      }

      const bookings = await bookingRepository.getUserBookings(userId);
      return bookings;
    } catch (error) {
      console.error('Get user bookings service error:', error);
      throw new Error('Không thể lấy danh sách đặt phòng: ' + error.message);
    }
  }


}

export default new BookingService();