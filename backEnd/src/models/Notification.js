import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const notificationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  user_id: { type: String, ref: "User", required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
