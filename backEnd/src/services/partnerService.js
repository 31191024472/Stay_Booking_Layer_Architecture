import hotelRepository from '../repositories/hotelRepository.js';
import roomRepository from '../repositories/RoomRepository.js';
import discountRepository from '../repositories/discountRepository.js';
import userRepository from '../repositories/userRepository.js';
import bookingRepository from '../repositories/bookingRepository.js';
import { AppError } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt';

class PartnerService {
  // Quản lý khách sạn
  async getHotels(partnerId) {
    try {
      const hotels = await hotelRepository.findByPartnerId(partnerId);
      return hotels.map(hotel => ({
        id: hotel._id,
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        starRating: hotel.starRating,
        amenities: hotel.amenities,
        images: hotel.images,
        status: hotel.status,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt
      }));
    } catch (error) {
      throw new AppError('Lỗi khi lấy danh sách khách sạn', 500);
    }
  }

  async createHotel(partnerId, hotelData) {
    try {
      // Kiểm tra xem partner có quyền tạo khách sạn không
      const partner = await userRepository.findById(partnerId);
      if (!partner || partner.role !== 'partner' || partner.partnerInfo.status !== 'approved') {
        throw new AppError('Không có quyền tạo khách sạn', 403);
      }

      // Validate dữ liệu
      if (!hotelData.name || !hotelData.address || !hotelData.city) {
        throw new AppError('Thiếu thông tin bắt buộc', 400);
      }

      // Thêm partnerId vào dữ liệu khách sạn
      const hotel = {
        ...hotelData,
        partnerId,
        status: 'pending'
      };

      const newHotel = await hotelRepository.createHotel(hotel);
      return {
        id: newHotel._id,
        name: newHotel.name,
        description: newHotel.description,
        address: newHotel.address,
        city: newHotel.city,
        starRating: newHotel.starRating,
        amenities: newHotel.amenities,
        images: newHotel.images,
        status: newHotel.status,
        createdAt: newHotel.createdAt,
        updatedAt: newHotel.updatedAt
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi tạo khách sạn mới', 500);
    }
  }

  async updateHotel(partnerId, hotelId, updateData) {
    try {
      // Kiểm tra quyền sở hữu
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (hotel.partnerId.toString() !== partnerId) {
        throw new AppError('Không có quyền cập nhật khách sạn này', 403);
      }

      // Chỉ cho phép cập nhật khi khách sạn đã được duyệt
      if (hotel.status !== 'approved') {
        throw new AppError('Không thể cập nhật khách sạn chưa được duyệt', 400);
      }

      const updatedHotel = await hotelRepository.updateHotel(hotelId, updateData);
      return {
        id: updatedHotel._id,
        name: updatedHotel.name,
        description: updatedHotel.description,
        address: updatedHotel.address,
        city: updatedHotel.city,
        starRating: updatedHotel.starRating,
        amenities: updatedHotel.amenities,
        images: updatedHotel.images,
        status: updatedHotel.status,
        createdAt: updatedHotel.createdAt,
        updatedAt: updatedHotel.updatedAt
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi cập nhật khách sạn', 500);
    }
  }

  async deleteHotel(partnerId, hotelId) {
    try {
      // Kiểm tra quyền sở hữu
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (hotel.partnerId.toString() !== partnerId) {
        throw new AppError('Không có quyền xóa khách sạn này', 403);
      }

      // Kiểm tra xem có phòng nào đang được đặt không
      const hasActiveBookings = await bookingRepository.hasActiveBookings(hotelId);
      if (hasActiveBookings) {
        throw new AppError('Không thể xóa khách sạn đang có đặt phòng', 400);
      }

      await hotelRepository.deleteHotel(hotelId);
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi xóa khách sạn', 500);
    }
  }

  // Quản lý phòng
  async getRooms(partnerId, hotelId) {
    try {
      // Kiểm tra quyền sở hữu
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (hotel.partnerId.toString() !== partnerId) {
        throw new AppError('Không có quyền xem phòng của khách sạn này', 403);
      }

      return await roomRepository.findByHotelId(hotelId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi lấy danh sách phòng', 500);
    }
  }

  async createRoom(partnerId, hotelId, roomData) {
    try {
      // Kiểm tra quyền sở hữu
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (hotel.partnerId.toString() !== partnerId) {
        throw new AppError('Không có quyền thêm phòng cho khách sạn này', 403);
      }

      const room = {
        ...roomData,
        hotelId,
        status: 'available'
      };

      return await roomRepository.create(room);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi tạo phòng mới', 500);
    }
  }

  // Quản lý khuyến mãi
  async getDiscounts(partnerId) {
    try {
      return await discountRepository.findByPartnerId(partnerId);
    } catch (error) {
      throw new AppError('Lỗi khi lấy danh sách khuyến mãi', 500);
    }
  }

  async createDiscount(partnerId, discountData) {
    try {
      // Kiểm tra quyền sở hữu khách sạn
      const hotel = await hotelRepository.findById(discountData.hotelId);
      if (!hotel) {
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (hotel.partnerId.toString() !== partnerId) {
        throw new AppError('Không có quyền tạo khuyến mãi cho khách sạn này', 403);
      }

      // Kiểm tra thời gian hợp lệ
      if (new Date(discountData.valid_from) >= new Date(discountData.valid_until)) {
        throw new AppError('Thời gian khuyến mãi không hợp lệ', 400);
      }

      const discount = {
        ...discountData,
        partnerId,
        status: 'active'
      };

      return await discountRepository.create(discount);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi tạo khuyến mãi mới', 500);
    }
  }

  // Quản lý tài khoản
  async getProfile(partnerId) {
    try {
      const profile = await userRepository.findById(partnerId);
      if (!profile) {
        throw new AppError('Không tìm thấy thông tin người dùng', 404);
      }
      return profile;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi lấy thông tin profile', 500);
    }
  }

  async updateProfile(partnerId, updateData) {
    try {
      return await userRepository.update(partnerId, updateData);
    } catch (error) {
      throw new AppError('Lỗi khi cập nhật thông tin profile', 500);
    }
  }

  // Thống kê và báo cáo
  async getDashboardStats(partnerId, startDate, endDate) {
    try {
      const [hotels, bookings, revenue] = await Promise.all([
        hotelRepository.countByPartnerId(partnerId),
        bookingRepository.getBookingStats(partnerId, startDate, endDate),
        bookingRepository.getRevenueStats(partnerId, startDate, endDate)
      ]);

      return {
        totalHotels: hotels,
        bookingStats: bookings,
        revenueStats: revenue
      };
    } catch (error) {
      throw new AppError('Lỗi khi lấy thống kê', 500);
    }
  }

  async getBookingReports(partnerId, startDate, endDate) {
    try {
      return await bookingRepository.getDetailedBookings(partnerId, startDate, endDate);
    } catch (error) {
      throw new AppError('Lỗi khi lấy báo cáo đặt phòng', 500);
    }
  }

  async getRevenueReports(partnerId, startDate, endDate) {
    try {
      return await bookingRepository.getDetailedRevenue(partnerId, startDate, endDate);
    } catch (error) {
      throw new AppError('Lỗi khi lấy báo cáo doanh thu', 500);
    }
  }

  async getOccupancyReports(partnerId, startDate, endDate) {
    try {
      return await bookingRepository.getOccupancyStats(partnerId, startDate, endDate);
    } catch (error) {
      throw new AppError('Lỗi khi lấy báo cáo tỷ lệ đặt phòng', 500);
    }
  }

  // Đổi mật khẩu
  async changePassword(partnerId, currentPassword, newPassword) {
    try {
      // Lấy thông tin partner
      const partner = await userRepository.findById(partnerId);
      if (!partner) {
        throw new AppError('Không tìm thấy thông tin người dùng', 404);
      }

      // Kiểm tra mật khẩu hiện tại
      const isPasswordValid = await bcrypt.compare(currentPassword, partner.password);
      if (!isPasswordValid) {
        throw new AppError('Mật khẩu hiện tại không đúng', 400);
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu mới
      await userRepository.updatePassword(partnerId, hashedPassword);

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Lỗi khi đổi mật khẩu', 500);
    }
  }
}

export default new PartnerService(); 