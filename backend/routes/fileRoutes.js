// routes/fileRoutes.js
import express from "express";
import multer from "multer";
import { uploadFile, getFiles, getFile, getLatestFile } from "../controllers/fileController.js"; // Add getLatestFile
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer();

// POST routes
router.post("/upload", protect, upload.single("file"), uploadFile);

// GET /latest must come BEFORE /:id (route specificity issue)
router.get("/latest", protect, getLatestFile);

// GET routes
router.get("/", protect, getFiles);
router.get("/:id", protect, getFile);

export default router;