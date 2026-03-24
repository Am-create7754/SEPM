import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// GET all teams
router.get("/", async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

// CREATE team
router.post("/", async (req, res) => {
  const team = new Team(req.body);
  await team.save();
  res.json(team);
});

// UPDATE TEAM (add/remove players)
router.put("/:id", async (req, res) => {
  const updated = await Team.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE TEAM
router.delete("/:id", async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ msg: "Team deleted" });
});

export default router;