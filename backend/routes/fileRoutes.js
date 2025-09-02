// routes/fileRoutes.js
import express from "express";
import multer from "multer";
import { uploadFile, getFiles, getFile, getLatestFile } from "../controllers/fileController.js"; // Add getLatestFile
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer();

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, getFiles);
router.get("/:id", protect, getFile);
router.get("/latest", protect, getLatestFile); // Add this line

export default router;