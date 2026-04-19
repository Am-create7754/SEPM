import express from "express";
import Tournament from "../models/Tournament.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. GET ALL TOURNAMENTS
router.get("/", protect, async (req, res) => {
  try {
    // Only fetch tournaments created by the current user
    const tournaments = await Tournament.find({ createdBy: req.user._id }).populate("teams matches");
    
    // Hamesha array bhejenge taaki frontend ka .map() kabhi na phate
    res.json(tournaments || []);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json([]); // Error aane par bhi empty array jayega
  }
});

// 2. CREATE TOURNAMENT
router.post("/", protect, async (req, res) => {
  try {
    const { name, teams, matches } = req.body;

    const newTournament = await Tournament.create({
      name,
      teams: teams || [],
      matches: matches || [],
      createdBy: req.user._id
    });

    res.status(201).json(newTournament);
  } catch (error) {
    res.status(400).json({ message: "Failed to create tournament", error: error.message });
  }
});

// 3. GET SINGLE TOURNAMENT BY ID
router.get("/:id", protect, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("teams")
      .populate({
        path: "matches",
        populate: [
          { path: "teamA" },
          { path: "teamB" }
        ]
      });
    
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tournament details" });
  }
});

// 4. DELETE TOURNAMENT
router.delete("/:id", protect, async (req, res) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tournament" });
  }
});

export default router;