// backend/models/loginHistory.js
import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("LoginHistory", loginHistorySchema);
