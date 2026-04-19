import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name hamesha hona chahiye
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["player", "organiser", "admin"],
    default: "player",
  },
  // Cricket Specific Fields
  playerRole: { 
    type: String, 
    enum: ["batsman", "bowler", "allrounder", "none"], 
    default: "none" 
  },
  batting: { 
    type: String, 
    enum: ["right", "left", "none"], 
    default: "none" 
  },
  bowling: { 
    type: String, 
    enum: ["pace", "spin", "none"], 
    default: "none" 
  },
  // Stats
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  matchesPlayed: { type: Number, default: 0 }
}, { timestamps: true });

// 🔥 Is tarah se export kar taaki 'OverwriteModelError' na aaye
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;