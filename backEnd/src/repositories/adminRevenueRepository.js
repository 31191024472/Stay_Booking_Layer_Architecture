import Booking from "../models/Booking.js";

class BookingRepository {
  async getConfirmedBookings() {
    return await Booking.aggregate([{ $match: { status: "pending" } }]);
  }
}

export default new BookingRepository();
