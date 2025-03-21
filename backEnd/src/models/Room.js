import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const roomSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  hotel_id: { type: String, ref: "Hotel", required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["Single", "Double", "Suite", "Deluxe"], required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Room", roomSchema);
