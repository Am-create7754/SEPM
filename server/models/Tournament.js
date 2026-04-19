import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  // 🔥 YE SABSE ZAROORI HAI: User isolation ke liye
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  ],

  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match"
    }
  ],

  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming"
  }
}, { timestamps: true }); // Timestamps se sorting asaan ho jayegi

// Overwrite protection ke saath export
const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);
export default Tournament;