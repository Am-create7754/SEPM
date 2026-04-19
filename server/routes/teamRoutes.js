import express from "express";
import Team from "../models/Team.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


/* =========================
   GET ALL TEAMS
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find({ createdBy: req.user._id });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET SINGLE TEAM
========================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   CREATE TEAM
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const team = new Team({
      name: req.body.name,
      maxPlayers: req.body.maxPlayers || 11,
      members: [],
      createdBy: req.user._id
    });

    await team.save();
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   ADD PLAYER
========================= */
router.put("/:id/add-player", protect, async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Player name required" });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    if (team.members.length >= team.maxPlayers) {
      return res.status(400).json({ msg: "Team is full" });
    }

    team.members.push({ name, role });
    await team.save();

    res.json(team);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   REMOVE PLAYER
========================= */
router.put("/:id/remove-player", protect, async (req, res) => {
  try {
    const { index } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    if (index < 0 || index >= team.members.length) {
      return res.status(400).json({ msg: "Invalid index" });
    }

    team.members.splice(index, 1);
    await team.save();

    res.json(team);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   DELETE TEAM
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ msg: "Team deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;