import Booking from "../models/Booking.js";

const createBooking = (bookingData) => Booking.create(bookingData);
const getUserBookings = (userId) => Booking.find({ user: userId }).sort({ bookingDate: -1 });

export default { createBooking, getUserBookings };