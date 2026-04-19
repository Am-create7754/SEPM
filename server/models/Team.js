import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: String,
  role: String,
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [playerSchema],
  maxPlayers: Number,
});

export default mongoose.model("Team", teamSchema);