import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

// CREATE MATCH
router.post("/", async (req, res) => {
  const match = await Match.create(req.body);
  res.json(match);
});

// GET MATCH
router.get("/:id", async (req, res) => {
  const match = await Match.findById(req.params.id);
  res.json(match);
});

// UPDATE MATCH
router.put("/:id", async (req, res) => {
  const updated = await Match.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

export default router;