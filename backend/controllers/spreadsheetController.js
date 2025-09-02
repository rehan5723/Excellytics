import mongoose from "mongoose";
import Spreadsheet from "../models/Spreadsheet.js";
export const getAllFiles = async (req, res) => {
  try {
    const files = await Spreadsheet.find().select("-__v"); // remove __v
    res.status(200).json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};
