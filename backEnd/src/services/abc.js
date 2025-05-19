import bookingRepository from '../../repositories/BookingRepository.js';
import hotelRepository from '../../repositories/hotelRepository.js';
import { AppError } from '../../utils/AppError.js';

class BookingService {
  // Lấy danh sách đặt phòng của khách sạn
  async getBookingsByHotel(partnerId, hotelId, filters = {}, pagination = {}) {
    try {
      console.log('Service: Bắt đầu lấy danh sách đặt phòng:', {
        partnerId,
        hotelId,
        filters,
        pagination
      });

      // 1. Kiểm tra quyền truy cập
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (!hotel.partner_id.equals(partnerId)) {
        throw new AppError('Không có quyền xem đặt phòng của khách sạn này', 403);
      }

      // 2. Lấy danh sách đặt phòng
      const bookings = await bookingRepository.findByHotelId(hotelId, filters, pagination);

      return bookings;
    } catch (error) {
      console.error('❌ Service: Lỗi trong getBookingsByHotel:', error);
      throw error instanceof AppError ? error : new AppError('Lỗi khi lấy danh sách đặt phòng', 500);
    }
  }

  // Lấy chi tiết một đặt phòng
  async getBookingDetail(partnerId, bookingId) {
    try {
      // 1. Kiểm tra quyền truy cập
      const booking = await bookingRepository.findById(bookingId);
      if (!booking) {
        throw new AppError('Không tìm thấy đặt phòng', 404);
      }

      const hotel = await hotelRepository.findById(booking.hotelId);
      if (!hotel || !hotel.partner_id.equals(partnerId)) {
        throw new AppError('Không có quyền xem chi tiết đặt phòng này', 403);
      }

      // 2. Lấy thông tin chi tiết
      return await bookingRepository.findById(bookingId);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Lỗi khi lấy chi tiết đặt phòng', 500);
    }
  }

  // Cập nhật trạng thái đặt phòng
  async updateBookingStatus(partnerId, bookingId, status) {
    try {
      // 1. Kiểm tra quyền truy cập
      const booking = await bookingRepository.findById(bookingId);
      if (!booking) {
        throw new AppError('Không tìm thấy đặt phòng', 404);
      }

      const hotel = await hotelRepository.findById(booking.hotelId);
      if (!hotel || !hotel.partner_id.equals(partnerId)) {
        throw new AppError('Không có quyền cập nhật trạng thái đặt phòng này', 403);
      }

      // 2. Kiểm tra trạng thái mới
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Trạng thái không hợp lệ', 400);
      }

      // 3. Cập nhật trạng thái
      return await bookingRepository.updateStatus(bookingId, status);
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Lỗi khi cập nhật trạng thái đặt phòng', 500);
    }
  }

  // Lấy thống kê đặt phòng
  async getBookingStats(partnerId, hotelId, dateRange = {}) {
    try {
      // 1. Kiểm tra quyền truy cập
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (!hotel.partner_id.equals(partnerId)) {
        throw new AppError('Không có quyền xem thống kê của khách sạn này', 403);
      }

      // 2. Lấy thống kê
      const stats = await bookingRepository.getStats(hotelId, dateRange);

      return {
        totalBookings: stats.totalBookings,
        totalRevenue: stats.totalRevenue,
        statusBreakdown: stats.statusBreakdown,
        monthlyStats: stats.monthlyStats
      };
    } catch (error) {
      throw error instanceof AppError ? error : new AppError('Lỗi khi lấy thống kê đặt phòng', 500);
    }
  }
}

export default new BookingService();