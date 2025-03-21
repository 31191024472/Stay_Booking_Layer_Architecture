import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const discountSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  code: { type: String, required: true, unique: true },
  discount_percentage: { type: Number, required: true },
  valid_from: { type: Date, required: true },
  valid_until: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Discount", discountSchema);
