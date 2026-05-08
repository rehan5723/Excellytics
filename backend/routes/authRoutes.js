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

import express from "express";
import { signup, login, googleLogin, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllFiles } from "../controllers/spreadsheetController.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);            // normal user signup
router.post("/login", login);              // login
router.post("/google-login", googleLogin); // google login

// Protected routes
router.get("/me", protect, getMe);         
router.get("/all", protect, getAllFiles); 

export default router;
