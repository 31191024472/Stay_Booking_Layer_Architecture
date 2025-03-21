import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const paymentMethodSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  cardType: { type: String, required: true, trim: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("PaymentMethod", paymentMethodSchema, "PaymentMethods");
