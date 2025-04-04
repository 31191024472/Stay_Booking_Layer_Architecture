import Room from "../models/Room.js";
import * as bookingRepo from "../repositories/adminBookingRespository.js";

export const getAllBookings = async () => await bookingRepo.getAllBookings();

export const getBookingById = async (id) =>
  await bookingRepo.getBookingById(id);

export const createBooking = async (bookingData) => {
  const { hotelId, roomType, rooms } = bookingData;

  // Kiểm tra phòng có đủ không
  const room = await Room.findOne({ hotelId, roomType });
  if (!room || room.availableRooms < rooms) {
    throw new Error("Loại phòng không khả dụng hoặc không đủ số lượng");
  }

  const newBooking = await bookingRepo.createBooking(bookingData);

  // Cập nhật số phòng còn lại
  room.availableRooms -= rooms;
  await room.save();

  return newBooking;
};

export const updateBooking = async (id, data) =>
  await bookingRepo.updateBooking(id, data);

export const cancelBooking = async (id) => {
  const booking = await bookingRepo.getBookingById(id);
  if (!booking) throw new Error("Booking không tồn tại");

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

  return booking;
};
