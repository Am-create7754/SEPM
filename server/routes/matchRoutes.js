import express from "express";
import Match from "../models/Match.js";
import Tournament from "../models/Tournament.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   GET ALL MATCHES (POPULATED)
========================= */
router.get("/", protect, async (req, res) => {
  try {
    // Migrate: Only fetch matches for this user
    const matches = await Match.find({ createdBy: req.user._id })
      .populate("teamA")
      .populate("teamB")
      .sort({ createdAt: -1 }); // Latest matches pehle dikhenge

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   CREATE MATCH
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const { teamA, teamB, date, tournamentId } = req.body;

    const match = new Match({
      teamA,
      teamB,
      date,
      createdBy: req.user._id
    });

    await match.save();

    // 🔥 LINK MATCH TO TOURNAMENT
    if (tournamentId) {
      await Tournament.findByIdAndUpdate(tournamentId, {
        $push: { matches: match._id }
      });
    }

    res.json(match);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET SINGLE MATCH (POPULATED)
========================= */
router.get("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("teamA")
      .populate("teamB");

    res.json(match);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   UPDATE MATCH
========================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE MATCH
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ msg: "Match not found" });
    }

    // 🔥 REMOVE FROM TOURNAMENT ALSO
    await Tournament.updateMany(
      { matches: match._id },
      { $pull: { matches: match._id } }
    );

    await Match.findByIdAndDelete(req.params.id);

    res.json({ msg: "Match deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   COMPLETE MATCH (Update Score & Winner)
========================= */
// routes/matchRoutes.js
router.put("/:id/complete", async (req, res) => {
  try {
    const { score, winner, target } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      {
        score: score, // Isme inning1 aur inning2 dono aayenge
        winner: winner,
        target: target,
        status: "completed"
      },
      { new: true }
    ).populate("winner teamA teamB");

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;