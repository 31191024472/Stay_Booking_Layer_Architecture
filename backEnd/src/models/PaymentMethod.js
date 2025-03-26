import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardType: { type: String, required: true, trim: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("PaymentMethod", paymentMethodSchema, "PaymentMethods");
