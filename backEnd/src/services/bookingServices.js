import bookingRepository from "../repositories/bookingRepository.js";

const createBooking = async (bookingData) => {
    return await bookingRepository.createBooking(bookingData);
  };
  
  const getUserBookings = async (userId) => {
    return await bookingRepository.getUserBookings(userId);
  };
  
  export default { createBooking, getUserBookings };