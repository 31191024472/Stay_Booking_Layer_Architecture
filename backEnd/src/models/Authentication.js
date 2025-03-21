import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const authenticationSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  user_id: { type: String, ref: "User", required: true },
  token: { type: String, required: true },
  expires_at: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Authentication", authenticationSchema);
