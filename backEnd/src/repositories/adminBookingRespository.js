import Booking from "../models/Booking.js";

export const getAllBookings = () =>
  Booking.find().populate("userId paymentMethodId hotelId");
export const getBookingById = (id) =>
  Booking.findById(id).populate("userId paymentMethodId hotelId");
export const createBooking = (data) => new Booking(data).save();
export const updateBooking = (id, data) =>
  Booking.findByIdAndUpdate(id, data, { new: true });
export const deleteBooking = (id) => Booking.findByIdAndDelete(id);
