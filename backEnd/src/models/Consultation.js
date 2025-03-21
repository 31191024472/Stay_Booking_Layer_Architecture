import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const consultationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  user_id: { type: String, ref: "User", required: true },
  question: { type: String, required: true },
  response: { type: String },
  status: { type: String, enum: ["Pending", "Answered"], default: "Pending" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Consultation", consultationSchema);
