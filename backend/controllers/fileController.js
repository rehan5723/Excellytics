import mongoose from "mongoose";
import Spreadsheet from "../models/Spreadsheet.js";
import { parseExcel } from "../utils/excelParser.js";

// Upload Excel
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const data = parseExcel(req.file.buffer);
    const sheet = await Spreadsheet.create({
      user: req.user._id,
      name: req.file.originalname,
      data,
    });

    res.status(201).json(sheet);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err });
  }
};

// Get all user's spreadsheets
export const getFiles = async (req, res) => {
  try {
    const files = await Spreadsheet.find({ user: req.user._id });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files", error: err });
  }
};

// Get single spreadsheet by ID or alias
export const getFile = async (req, res) => {
  const { id } = req.params;

  try {
    let file;

    if (id === "latest") {
      file = await Spreadsheet.findOne({ user: req.user._id })
        .sort({ createdAt: -1 })
        .select("data name");
    } else if (mongoose.Types.ObjectId.isValid(id)) {
      file = await Spreadsheet.findById(id);
    } else {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    if (!file) return res.status(404).json({ message: "File not found" });

    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ message: "Error fetching file", error: err });
  }
};

// Explicit endpoint for latest file
export const getLatestFile = async (req, res) => {
  try {
    const latestFile = await Spreadsheet.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select("data name");

    if (!latestFile) {
      return res.status(404).json({ error: "No files found" });
    }

    res.status(200).json({
      data: latestFile.data,
      fileName: latestFile.name,
    });
  } catch (error) {
    console.error("Error fetching latest file:", error);
    res.status(500).json({ error: "Server error fetching latest file" });
  }
};