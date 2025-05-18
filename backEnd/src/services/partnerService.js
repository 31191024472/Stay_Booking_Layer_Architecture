import hotelRepository from '../repositories/hotelRepository.js';
import roomRepository from '../repositories/RoomRepository.js';
import discountRepository from '../repositories/discountRepository.js';
import userRepository from '../repositories/userRepository.js';
import bookingRepository from '../repositories/bookingRepository.js';
import { AppError } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

class PartnerService {
  // Quản lý khách sạn
  async getHotels(partnerId) {
    try {
      // console.log('🔍 Đang tìm khách sạn cho partnerId:', partnerId);
      const hotels = await hotelRepository.findByPartnerId(partnerId);
      // console.log('📦 Kết quả từ repository:', hotels);

      if (!hotels || hotels.length === 0) {
        // console.log('⚠️ Không tìm thấy khách sạn nào cho partner này');
        return [];
      }

      const mappedHotels = hotels.map(hotel => ({
        id: hotel._id,
        hotelCode: hotel.hotelCode,
        title: hotel.title,
        subtitle: hotel.subtitle,
        description: hotel.description,
        cityId: hotel.cityId,
        propertyType: hotel.propertyType,
        benefits: hotel.benefits,
        ratings: hotel.ratings,
        imageUrls: hotel.imageUrls,
        rooms: hotel.rooms,
        address: hotel.address,
        status: hotel.status,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt
      }));

      // console.log('✅ Đã map dữ liệu thành công:', mappedHotels);
      return mappedHotels;
    } catch (error) {
      console.error('❌ Lỗi trong getHotels:', error);
      throw new AppError('Lỗi khi lấy danh sách khách sạn', 500);
    }
  }

  async createHotel(partnerId, hotelData) {
    try {
      // 1. Kiểm tra partner
      // console.log('🔍 Kiểm tra thông tin partner...');
      const partner = await userRepository.findById(partnerId);
      // console.log('👤 Thông tin partner:', {
      //   id: partner?._id,
      //   role: partner?.role,
      //   email: partner?.email
      // });

      if (!partner) {
        throw new AppError('Không tìm thấy thông tin partner', 404);
      }

      if (partner.role !== 'partner') {
        throw new AppError('Không có quyền tạo khách sạn', 403);
      }

      // 2. Tạo mã khách sạn
      const lastHotel = await hotelRepository.findLastHotel();
      console.log('📊 Thông tin khách sạn cuối cùng:', {
        id: lastHotel?._id,
        hotelCode: lastHotel?.hotelCode
      });

      const hotelCode = lastHotel ? lastHotel.hotelCode + 25 : 1001;
      console.log('✨ Mã khách sạn mới:', hotelCode);

      // 3. Chuẩn bị dữ liệu khách sạn
      console.log('📦 Chuẩn bị dữ liệu khách sạn...');
      const hotel = {
        ...hotelData,
        hotelCode,
        partner_id: partnerId,
        ratings: hotelData.ratings || 0,
        status: hotelData.status || 'Chưa xét duyệt',
        address: hotelData.address || 'Chưa Cập Nhật',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('📋 Dữ liệu khách sạn đã chuẩn bị:', {
        hotelCode: hotel.hotelCode,
        title: hotel.title,
        cityId: hotel.cityId,
        propertyType: hotel.propertyType,
        benefitsCount: hotel.benefits?.length || 0,
        imageUrlsCount: hotel.imageUrls?.length || 0,
        roomsCount: hotel.rooms?.length || 0
      });

      // 4. Lưu khách sạn vào database
      console.log('💾 Đang lưu khách sạn vào database...');
      const newHotel = await hotelRepository.createHotel(hotel);
      console.log('✅ Đã lưu khách sạn thành công:', {
        id: newHotel._id,
        hotelCode: newHotel.hotelCode
      });

      // 5. Format dữ liệu trả về
      const response = {
        id: newHotel._id,
        hotelCode: newHotel.hotelCode,
        title: newHotel.title,
        subtitle: newHotel.subtitle,
        description: newHotel.description,
        cityId: newHotel.cityId,
        propertyType: newHotel.propertyType,
        benefits: newHotel.benefits,
        ratings: newHotel.ratings,
        imageUrls: newHotel.imageUrls,
        rooms: newHotel.rooms,
        status: newHotel.status,
        address: newHotel.address,
        createdAt: newHotel.createdAt,
        updatedAt: newHotel.updatedAt
      };

      console.log('🎉 Hoàn thành tạo khách sạn:', {
        id: response.id,
        hotelCode: response.hotelCode,
        title: response.title
      });

      return response;

    } catch (error) {
      console.error('❌ Lỗi trong createHotel:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code
      });

      if (error instanceof AppError) {
        console.error('🚨 AppError:', {
          statusCode: error.statusCode,
          message: error.message
        });
        throw error;
      }

      // Xử lý các lỗi cụ thể
      if (error.name === 'ValidationError') {
        console.error('🚨 ValidationError:', error.errors);
        throw new AppError('Dữ liệu không hợp lệ: ' + Object.values(error.errors).map(err => err.message).join(', '), 400);
      }

      if (error.code === 11000) {
        console.error('🚨 DuplicateKeyError:', error.keyValue);
        throw new AppError('Mã khách sạn đã tồn tại', 400);
      }

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

      if (!hotel.partner_id.equals(partnerId)) {
        console.log('khong co quyen xoa khach san nay')
        throw new AppError('Không có quyền xóa khách sạn này', 403);
      }
      // Chỉ cho phép cập nhật các trường được phép
      const allowedUpdates = [
        'title',
        'subtitle',
        'description',
        'cityId',
        'propertyType',
        'benefits',
        'imageUrls'
      ];

      const filteredUpdateData = Object.keys(updateData)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      // Thêm thời gian cập nhật
      filteredUpdateData.updatedAt = new Date();

      const updatedHotel = await hotelRepository.updateHotel(hotelId, filteredUpdateData);
      return {
        id: updatedHotel._id,
        hotelCode: updatedHotel.hotelCode,
        title: updatedHotel.title,
        subtitle: updatedHotel.subtitle,
        description: updatedHotel.description,
        cityId: updatedHotel.cityId,
        propertyType: updatedHotel.propertyType,
        benefits: updatedHotel.benefits,
        ratings: updatedHotel.ratings,
        imageUrls: updatedHotel.imageUrls,
        rooms: updatedHotel.rooms,
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
        console.log('khong tim thay khach san')
        throw new AppError('Không tìm thấy khách sạn', 404);
      }

      if (!hotel.partner_id.equals(partnerId)) {
        console.log('khong co quyen xoa khach san nay')
        throw new AppError('Không có quyền xóa khách sạn này', 403);
      }

      // Xóa tất cả phòng của khách sạn
      // await roomRepository.deleteByHotelId(hotelId);

      // Xóa khách sạn
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
      // 1. Kiểm tra partner tồn tại và có quyền
      const partner = await userRepository.findById(partnerId);
      if (!partner) {
        console.error('❌ Không tìm thấy partner');
        throw new AppError('Không tìm thấy partner', 404);
      }
  
      if (partner.role !== 'partner') {
        console.error('❌ Không có quyền xem danh sách phòng');
        throw new AppError('Không có quyền xem danh sách phòng', 403);
      }
  
      // 2. Kiểm tra khách sạn tồn tại
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        console.error('❌ Không tìm thấy khách sạn');
        throw new AppError('Không tìm thấy khách sạn', 404);
      }
  
      // 3. Kiểm tra quyền sở hữu
      if (!hotel.partner_id.equals(partnerId)) {
        console.error('❌ Không có quyền xem danh sách phòng của khách sạn này');
        throw new AppError('Không có quyền xem danh sách phòng của khách sạn này', 403);
      }
      // 4. Lấy danh sách phòng
      const rooms = await roomRepository.findByHotelId(hotelId);
      return rooms;
  
    } catch (error) {
      console.error('❌ Service: Lỗi trong getRooms:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
  
      if (error instanceof AppError) {
        throw error;
      }
  
      throw new AppError('Lỗi khi lấy danh sách phòng', 500);
    }
  }

  async createRoom(partnerId, hotelId, roomData) {
    try {
      console.log(' Service: Bắt đầu tạo phòng mới:', {
        partnerId,
        hotelId,
        roomData
      });
  
      // 1. Kiểm tra partner tồn tại và có quyền
      const partner = await userRepository.findById(partnerId);
      if (!partner) {
        console.error('❌ Không tìm thấy partner');
        throw new AppError('Không tìm thấy partner', 404);
      }
  
      if (partner.role !== 'partner') {
        console.error('❌ Không có quyền tạo phòng');
        throw new AppError('Không có quyền tạo phòng', 403);
      }
  
      // 2. Kiểm tra khách sạn tồn tại
      const hotel = await hotelRepository.findById(hotelId);
      if (!hotel) {
        console.error('❌ Không tìm thấy khách sạn');
        throw new AppError('Không tìm thấy khách sạn', 404);
      }
  
      // 3. Kiểm tra quyền sở hữu
      if (!hotel.partner_id.equals(partnerId)) {
        console.error('❌ Không có quyền tạo phòng cho khách sạn này');
        throw new AppError('Không có quyền tạo phòng cho khách sạn này', 403);
      }
  
      // 4. Chuẩn bị dữ liệu phòng
      const room = {
        hotelId: new mongoose.Types.ObjectId(hotelId),
        roomType: roomData.roomType,
        description: roomData.description,
        pricePerNight: roomData.pricePerNight,
        maxOccupancy: roomData.maxOccupancy,
        bedType: roomData.bedType,
        amenities: roomData.amenities || [],
        totalRooms: roomData.totalRooms,
        availableRooms: roomData.availableRooms || roomData.totalRooms,
        imageUrls: roomData.imageUrls || [],
        isActive: roomData.isActive ?? true,
        discount: {
          percentage: roomData.discount?.percentage || 0
        },
        hotelCode: hotel.hotelCode
      };
  
      // 5. Tạo phòng mới
      const newRoom = await roomRepository.create(room);
  
      console.log('✅ Service: Tạo phòng thành công:', {
        roomId: newRoom._id,
        hotelId: newRoom.hotelId
      });
  
      return newRoom;
  
    } catch (error) {
      console.error('❌ Service: Lỗi trong createRoom:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
  
      if (error instanceof AppError) {
        throw error;
      }
  
      throw new AppError('Lỗi khi tạo phòng mới', 500);
    }
  }
  async updateRoom(partnerId, roomId, updateData) {
    try {
      console.log(' Service: Bắt đầu cập nhật phòng:', {
        partnerId,
        roomId,
        updateData,
      });
  
      // 1. Kiểm tra partner tồn tại và có quyền
      const partner = await userRepository.findById(partnerId);
      if (!partner) {
        console.error('❌ Không tìm thấy partner');
        throw new AppError('Không tìm thấy partner', 404);
      }
  
      if (partner.role !== 'partner') {
        console.error('❌ Không có quyền cập nhật phòng');
        throw new AppError('Không có quyền cập nhật phòng', 403);
      }
  
      // 2. Kiểm tra phòng tồn tại
      const room = await roomRepository.findById(roomId);
      if (!room) {
        console.error('❌ Không tìm thấy phòng');
        throw new AppError('Không tìm thấy phòng', 404);
      }
      // console.log('>>>>>Chekc hotelId', room.hotelId)
      // // 3. Kiểm tra khách sạn tồn tại
      // const hotel = await hotelRepository.findById(room.hotelId);
      // if (!hotel) {
      //   console.error('❌ Không tìm thấy khách sạn');
      //   throw new AppError('Không tìm thấy khách sạn', 404);
      // }
  
      // 4. Kiểm tra quyền sở hữu
      if (!hotel.partner_id.equals(partnerId)) {
        console.error('❌ Không có quyền cập nhật phòng của khách sạn này');
        throw new AppError('Không có quyền cập nhật phòng của khách sạn này', 403);
      }
  
      // // 5. Kiểm tra số phòng khả dụng
      // if (updateData.availableRooms && updateData.availableRooms > updateData.totalRooms) {
      //   console.error('❌ Số phòng khả dụng không thể lớn hơn tổng số phòng');
      //   throw new AppError('Số phòng khả dụng không thể lớn hơn tổng số phòng', 400);
      // }
  
      // 6. Chuẩn bị dữ liệu cập nhật
      const roomUpdateData = {
        roomType: updateData.roomType,
        description: updateData.description,
        pricePerNight: updateData.pricePerNight,
        maxOccupancy: updateData.maxOccupancy,
        bedType: updateData.bedType,
        amenities: updateData.amenities,
        totalRooms: updateData.totalRooms,
        availableRooms: updateData.availableRooms,
        imageUrls: updateData.imageUrls,
        isActive: updateData.isActive,
        discount: {
          percentage: updateData.discount?.percentage || 0
        }
      };
  
      // 7. Cập nhật phòng
      const updatedRoom = await roomRepository.update(roomId, roomUpdateData);
  
      console.log('✅ Service: Cập nhật phòng thành công:', {
        roomId: updatedRoom._id,
        hotelId: updatedRoom.hotelId
      });
  
      return updatedRoom;
  
    } catch (error) {
      console.error('❌ Service: Lỗi trong updateRoom:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
  
      if (error instanceof AppError) {
        throw error;
      }
  
      throw new AppError('Lỗi khi cập nhật phòng', 500);
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