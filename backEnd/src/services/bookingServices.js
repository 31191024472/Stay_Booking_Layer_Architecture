import bookingRepository from "../repositories/bookingRepository.js";

const createBooking = async (bookingData) => {
    return await bookingRepository.createBooking(bookingData);
  };
  
  const getUserBookings = async () => {
    return await bookingRepository.getUserBookings();
  };

 const confirmBooking = async (bookingtData) => {
    const booking = new bookingRepository(bookingtData);
    return await booking.save()
  };
  
  export default { createBooking, getUserBookings, confirmBooking };