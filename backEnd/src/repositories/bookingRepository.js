import Booking from "../models/Booking.js";

class BookingRepository {
   // Tìm đặt phòng theo ID
   async findById(id) {
    try {
      return await Booking.findById(id)
        .populate('userId', 'name email phone')
        .populate('roomId', 'name price')
        .populate('paymentMethodId');
    } catch (error) {
      throw new Error('Lỗi khi tìm đặt phòng');
    }
  }
  // Tìm đặt phòng theo khách sạn
  async findByHotelId(hotelCode) {
    try {
      return await Booking.find({ hotelId: hotelCode })
        .populate('userId', 'name email phone')
        .populate('roomId', 'name price')
        .populate('paymentMethodId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Repository: Lỗi trong findByHotelId:', error);
      throw new Error('Lỗi khi tìm đặt phòng');
    }
  }
          
  async createBooking(bookingData) {
    try {
      const booking = new Booking(bookingData);
      return await booking.save();
    } catch (error) {
      console.error('Create booking repository error:', error);
      throw new Error('Lỗi khi tạo đặt phòng');
    }
  }

  async getUserBookings(userId) {
    try {
      return await Booking.find({ userId })
        .populate('paymentMethodId')
        .populate('roomId', 'name price')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      console.error('Get user bookings repository error:', error);
      throw new Error('Lỗi khi lấy danh sách đặt phòng của người dùng');
    }
  }
}

export default new BookingRepository();