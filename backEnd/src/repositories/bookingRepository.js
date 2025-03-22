import Booking from "../models/Booking.js";

const createBooking = (bookingData) => Booking.create(bookingData);
const getUserBookings = async () =>{
    return await Booking.find()
}

export default { createBooking, getUserBookings };