import partnerService from '../services/partnerService.js';
import { validateRequest } from '../utils/validator.js';

// Quản lý khách sạn
export const getHotels = async (req, res) => {
  try {
    const hotels = await partnerService.getHotels(req.user._id);
    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('🚨 Error in getHotels:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách khách sạn'
    });
  }
};

export const createHotel = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      name: 'required|string',
      address: 'required|string',
      city: 'required|string',
      description: 'required|string',
      starRating: 'required|numeric|min:1|max:5',
      amenities: 'array',
      images: 'array'
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: validation.errors
      });
    }

    const hotel = await partnerService.createHotel(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo khách sạn thành công, đang chờ duyệt',
      data: hotel
    });
  } catch (error) {
    console.error('🚨 Error in createHotel:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo khách sạn mới'
    });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      name: 'string',
      address: 'string',
      city: 'string',
      description: 'string',
      starRating: 'numeric|min:1|max:5',
      amenities: 'array',
      images: 'array'
    });

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: validation.errors
      });
    }

    const hotel = await partnerService.updateHotel(
      req.user._id,
      req.params.hotelId,
      req.body
    );

    res.json({
      success: true,
      message: 'Cập nhật khách sạn thành công',
      data: hotel
    });
  } catch (error) {
    console.error('🚨 Error in updateHotel:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật khách sạn'
    });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    await partnerService.deleteHotel(
      req.user._id,
      req.params.hotelId
    );

    res.json({
      success: true,
      message: 'Xóa khách sạn thành công'
    });
  } catch (error) {
    console.error('🚨 Error in deleteHotel:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa khách sạn'
    });
  }
};

export const getHotelDetails = async (req, res) => {
  try {
    const hotel = await partnerService.getHotelDetails(
      req.user._id,
      req.params.hotelId
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách sạn'
      });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('🚨 Error in getHotelDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin khách sạn'
    });
  }
};

// Quản lý phòng
export const getRooms = async (req, res) => {
  try {
    const rooms = await partnerService.getRooms(
      req.user._id,
      req.params.hotelId
    );
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('🚨 Error in getRooms:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách phòng'
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      'basic.name': 'required|string',
      'basic.type': 'required|string',
      'basic.capacity': 'required|numeric',
      'pricing.basePrice': 'required|numeric',
      'inventory.total': 'required|numeric'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const room = await partnerService.createRoom(
      req.user._id,
      req.params.hotelId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('🚨 Error in createRoom:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo phòng mới'
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      'basic.name': 'string',
      'basic.type': 'string',
      'basic.capacity': 'numeric|min:1',
      'pricing.basePrice': 'numeric|min:0',
      'pricing.discount': 'numeric|min:0|max:100',
      'inventory.total': 'numeric|min:0',
      'inventory.available': 'numeric|min:0',
      'amenities': 'array',
      'images': 'array',
      'status': 'in:available,unavailable,maintenance'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const room = await partnerService.updateRoom(
      req.user._id,
      req.params.roomId,
      req.body
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('🚨 Error in updateRoom:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật phòng'
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    // Kiểm tra quyền sở hữu và xóa phòng
    await partnerService.deleteRoom(
      req.user._id,
      req.params.roomId
    );

    res.json({
      success: true,
      message: 'Xóa phòng thành công'
    });
  } catch (error) {
    console.error('🚨 Error in deleteRoom:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa phòng'
    });
  }
};

// Quản lý khuyến mãi
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await partnerService.getDiscounts(req.user._id);
    res.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('🚨 Error in getDiscounts:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách khuyến mãi'
    });
  }
};

export const createDiscount = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      code: 'required|string|minLength:3|maxLength:20',
      name: 'required|string',
      description: 'required|string',
      discountType: 'required|in:percentage,fixed',
      discountValue: 'required|numeric|min:0',
      minOrderValue: 'numeric|min:0',
      maxDiscountValue: 'numeric|min:0',
      startDate: 'required|date',
      endDate: 'required|date',
      hotelId: 'required|string',
      usageLimit: 'numeric|min:1',
      status: 'in:active,inactive'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const discount = await partnerService.createDiscount(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('🚨 Error in createDiscount:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi tạo khuyến mãi mới'
    });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      name: 'string',
      description: 'string',
      discountType: 'in:percentage,fixed',
      discountValue: 'numeric|min:0',
      minOrderValue: 'numeric|min:0',
      maxDiscountValue: 'numeric|min:0',
      startDate: 'date',
      endDate: 'date',
      usageLimit: 'numeric|min:1',
      status: 'in:active,inactive'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const discount = await partnerService.updateDiscount(
      req.user._id,
      req.params.discountId,
      req.body
    );

    res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('🚨 Error in updateDiscount:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật khuyến mãi'
    });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    await partnerService.deleteDiscount(
      req.user._id,
      req.params.discountId
    );

    res.json({
      success: true,
      message: 'Xóa khuyến mãi thành công'
    });
  } catch (error) {
    console.error('🚨 Error in deleteDiscount:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa khuyến mãi'
    });
  }
};

export const getDiscountDetails = async (req, res) => {
  try {
    const discount = await partnerService.getDiscountDetails(
      req.user._id,
      req.params.discountId
    );

    res.json({
      success: true,
      data: discount
    });
  } catch (error) {
    console.error('🚨 Error in getDiscountDetails:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin khuyến mãi'
    });
  }
};

// Quản lý tài khoản
export const getProfile = async (req, res) => {
  try {
    const profile = await partnerService.getProfile(req.user._id);
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('🚨 Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin profile'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      'profile.firstName': 'string',
      'profile.lastName': 'string',
      'profile.phone': 'string',
      'partnerInfo.companyName': 'string',
      'partnerInfo.taxCode': 'string',
      'partnerInfo.address': 'string'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const profile = await partnerService.updateProfile(
      req.user._id,
      req.body
    );

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('🚨 Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông tin profile'
    });
  }
};

// Thống kê và báo cáo
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = await partnerService.getDashboardStats(
      req.user._id,
      startDate,
      endDate
    );
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('🚨 Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê'
    });
  }
};

// Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const validation = validateRequest(req.body, {
      currentPassword: 'required|string',
      newPassword: 'required|string|minLength:6',
      confirmPassword: 'required|string'
    });

    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
      });
    }

    // Gọi service để đổi mật khẩu
    await partnerService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('🚨 Error in changePassword:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi đổi mật khẩu'
    });
  }
};

// Lấy báo cáo đặt phòng
export const getBookingReports = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const reports = await partnerService.getBookingReports(
      req.user._id,
      startDate,
      endDate,
      status
    );
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('🚨 Error in getBookingReports:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo đặt phòng'
    });
  }
};

// Lấy báo cáo doanh thu
export const getRevenueReports = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    const reports = await partnerService.getRevenueReports(
      req.user._id,
      startDate,
      endDate,
      groupBy
    );
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('🚨 Error in getRevenueReports:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo doanh thu'
    });
  }
};

// Lấy báo cáo tỷ lệ đặt phòng
export const getOccupancyReports = async (req, res) => {
  try {
    const { startDate, endDate, hotelId } = req.query;
    const reports = await partnerService.getOccupancyReports(
      req.user._id,
      startDate,
      endDate,
      hotelId
    );
    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('🚨 Error in getOccupancyReports:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo tỷ lệ đặt phòng'
    });
  }
};

// Lấy chi tiết phòng
export const getRoomDetails = async (req, res) => {
  try {
    const room = await partnerService.getRoomDetails(
      req.user._id,
      req.params.roomId
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('🚨 Error in getRoomDetails:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin phòng'
    });
  }
};
