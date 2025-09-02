// backend/models/Spreadsheet.js
import mongoose from "mongoose";

const spreadsheetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    data: { type: Array, default: [] }, // store Excel rows as array of objects
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model("Spreadsheet", spreadsheetSchema);
