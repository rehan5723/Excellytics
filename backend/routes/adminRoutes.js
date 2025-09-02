import express from "express";
import {
  getUsers,
  deleteUser,
  getDatasets,
  deleteDataset,
  getLoginHistory,
  deleteLoginHistory,
} from "../controllers/adminController.js";

const router = express.Router();

// Users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Datasets
router.get("/datasets", getDatasets);
router.delete("/datasets/:id", deleteDataset);

// Login history
router.get("/login-history", getLoginHistory);
router.delete("/login-history/:id", deleteLoginHistory);

export default router;
