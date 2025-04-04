import Booking from "../models/Booking.js";

class BookingRepository {
  async getConfirmedBookings() {
    return await Booking.aggregate([{ $match: { status: "Confirmed" } }]);
  }
}

export default new BookingRepository();
