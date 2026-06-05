import express from "express";
import Tournament from "../models/Tournament.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. GET ALL TOURNAMENTS
router.get("/", protect, async (req, res) => {
  try {
    let tournaments;
    if (req.user.role === "player") {
      // Players see all tournaments
      tournaments = await Tournament.find({})
        .populate("teams matches")
        .populate("joinRequests.team");
    } else {
      // Organisers/Admins see their own tournaments
      tournaments = await Tournament.find({ createdBy: req.user._id })
        .populate("teams matches")
        .populate("joinRequests.team");
    }
    
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
      .populate("joinRequests.team")
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

// 5. JOIN TOURNAMENT (REQUEST)
router.post("/:id/join", protect, async (req, res) => {
  try {
    const { teamId } = req.body;
    
    if (!teamId) return res.status(400).json({ message: "Team ID is required" });

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    // Check if team already requested or joined
    const joinReqs = tournament.joinRequests || [];
    const alreadyRequested = joinReqs.find(r => r.team?.toString() === teamId);
    if (alreadyRequested) {
      return res.status(400).json({ message: `Your team request is already ${alreadyRequested.status}` });
    }

    const tms = tournament.teams || [];
    const alreadyJoined = tms.find(t => t?.toString() === teamId);
    if (alreadyJoined) {
      return res.status(400).json({ message: "Your team is already in this tournament" });
    }

    if (!tournament.joinRequests) {
      tournament.joinRequests = [];
    }
    tournament.joinRequests.push({ team: teamId, status: "pending" });
    await tournament.save();

    res.json({ message: "Join request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending join request", error: error.message });
  }
});

// 6. APPROVE/REJECT JOIN REQUEST
router.put("/:id/requests/:requestId", protect, async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: "Tournament not found" });

    // Only creator can approve/reject
    if (tournament.createdBy.toString() !== req.user._id.toString() && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Not authorized to manage this tournament" });
    }

    const request = tournament.joinRequests.id(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;

    // If approved, add team to tournament teams array
    if (status === "approved") {
      if (!tournament.teams.includes(request.team)) {
        tournament.teams.push(request.team);
      }
    }

    await tournament.save();
    res.json({ message: `Request ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error updating request status", error: error.message });
  }
});

export default router;