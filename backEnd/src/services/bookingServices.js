import bookingRepository from "../repositories/bookingRepository.js";

class BookingService {
  async createBooking(bookingData) {
    try {
      // Validate dữ liệu
      this.validateBookingData(bookingData);

      // Tạo booking mới
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

  validateBookingData(bookingData) {
    if (!bookingData.userId) {
      throw new Error('UserId không được để trống');
    }
    if (!bookingData.hotelId) {
      throw new Error('HotelId không được để trống');
    }
    if (!bookingData.checkIn || !bookingData.checkOut) {
      throw new Error('Ngày check-in và check-out không được để trống');
    }
    if (bookingData.checkIn >= bookingData.checkOut) {
      throw new Error('Ngày check-in phải trước ngày check-out');
    }
    if (!bookingData.guests || bookingData.guests < 1) {
      throw new Error('Số khách không hợp lệ');
    }
    if (!bookingData.rooms || bookingData.rooms < 1) {
      throw new Error('Số phòng không hợp lệ');
    }
    if (!bookingData.roomType) {
      throw new Error('Loại phòng không được để trống');
    }
    if (!bookingData.totalPrice || bookingData.totalPrice <= 0) {
      throw new Error('Tổng tiền không hợp lệ');
    }
    if (!bookingData.paymentMethodId) {
      throw new Error('Phương thức thanh toán không được để trống');
    }
  }
}

export default new BookingService();