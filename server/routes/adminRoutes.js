import express from "express";
const router = express.Router();

// Controllers import (Dhyan rakhna .js extension zaroori hai)
import {
  getProfile,
  createProfile,
  updateProfile,
  getSettings,
  updateSettings,
  deleteAllTournaments,
} from "../controllers/adminController.js";

// Middleware import
import { protect, adminOnly } from "../middleware/authMiddleware.js";

// Routes definition
router.get("/profile", protect, getProfile);
router.post("/profile", protect, createProfile);
router.put("/profile", protect, updateProfile);

router.get("/settings", protect, adminOnly, getSettings);
router.put("/settings", protect, adminOnly, updateSettings);

router.delete(
  "/delete-all-tournaments",
  protect,
  adminOnly,
  deleteAllTournaments
);

export default router; // 🔥 module.exports ki jagah ye aayega