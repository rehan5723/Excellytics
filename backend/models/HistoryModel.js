import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  uploads: [
    {
      fileName: String,
      rows: Number,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("History", HistorySchema);
