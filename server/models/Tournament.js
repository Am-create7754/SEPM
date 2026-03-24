import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: String,
  teams: [String],
  matches: [Object],
});

export default mongoose.model("Tournament", tournamentSchema);