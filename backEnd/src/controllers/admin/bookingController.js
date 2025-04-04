import Booking from "../../models/Booking.js";
import Hotel from "../../models/Hotel.js";
import Room from "../../models/Room.js";

// Lấy danh sách tất cả booking
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(
      "userId paymentMethodId hotelId"
    );
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Lấy thông tin booking theo ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate(
      "userId paymentMethodId hotelId"
    );
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

// Tạo booking mới
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      hotelId,
      checkIn,
      checkOut,
      guests,
      rooms,
      roomType,
      totalPrice,
      paymentMethodId,
    } = req.body;

    // Kiểm tra xem khách sạn có tồn tại không
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res
        .status(400)
        .json({ success: false, message: "Khách sạn không tồn tại" });
    }

    // Kiểm tra xem loại phòng có hợp lệ không
    const room = await Room.findOne({ hotelId, roomType });
    if (!room || room.availableRooms < rooms) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Loại phòng không khả dụng hoặc không đủ số lượng",
        });
    }

    // Tạo booking mới
    const newBooking = new Booking({
      userId,
      hotelId,
      checkIn,
      checkOut,
      guests,
      rooms,
      roomType,
      totalPrice,
      paymentMethodId,
    });

    await newBooking.save();

    // Cập nhật số phòng còn lại
    room.availableRooms -= rooms;
    await room.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Đặt phòng thành công!",
        booking: newBooking,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Cập nhật booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, guests, rooms, roomType, totalPrice, status } =
      req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        checkIn,
        checkOut,
        guests,
        rooms,
        roomType,
        totalPrice,
        status,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking không tồn tại" });
    }

    res.json({
      success: true,
      message: "Cập nhật booking thành công",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

// Hủy booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy booking" });
    }

    // Kiểm tra trạng thái trước khi hủy
    if (booking.status === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Booking đã bị hủy trước đó" });
    }

    // Cập nhật trạng thái booking
    booking.status = "Cancelled";
    await booking.save();

    // Hoàn lại số phòng
    const room = await Room.findOne({
      hotelId: booking.hotelId,
      roomType: booking.roomType,
    });
    if (room) {
      room.availableRooms += booking.rooms;
      await room.save();
    }

    res.json({ success: true, message: "Booking đã được hủy", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};
