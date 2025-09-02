// // routes/authRoutes.js
// import express from "express";
// import { signup, login } from "../controllers/authController.js";
// import { getMe } from "../controllers/authController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// import {getAllFiles} from "../controllers/spreadsheetController.js"
// const router = express.Router();
// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/me", protect, getMe);
// router.get("/all",protect,getAllFiles);
// export default router;

// routes/authRoutes.js
import express from "express";
import { signup, login, createAdmin, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllFiles } from "../controllers/spreadsheetController.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);            // normal user signup
router.post("/login", login);              // login
router.post("/create-admin", createAdmin); // admin signup with secret

// Protected routes
router.get("/me", protect, getMe);         
router.get("/all", protect, getAllFiles); 

export default router;
