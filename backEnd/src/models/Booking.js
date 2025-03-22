import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const bookingSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  bookingId: { type: String, required: true, unique: true },
  bookingDate: { type: Date, required: true },
  hotelName: { type: String, required: true, trim: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalFare: { type: String, required: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema, "Bookings");
