const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  deleteAllTournaments,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/AuthMiddleware");

router.get("/profile", protect, adminOnly, getProfile);
router.put("/profile", protect, adminOnly, updateProfile);

router.get("/settings", protect, adminOnly, getSettings);
router.put("/settings", protect, adminOnly, updateSettings);

router.delete(
  "/delete-all-tournaments",
  protect,
  adminOnly,
  deleteAllTournaments
);

module.exports = router;
