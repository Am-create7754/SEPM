import mongoose from "mongoose";

const ballSchema = new mongoose.Schema({
  runs: Number,
  extra: String,
  isWicket: Boolean,
  direction: String
});

const matchSchema = new mongoose.Schema({
  // 🔥 TEAMS
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: { type: String, default: "upcoming" },

  setup: {
    overs: Number,
    ground: String,
    city: String,
    ballType: String
  },

  toss: {
    winner: String,
    decision: String
  },

  players: {
    striker: Object,
    nonStriker: Object,
    bowler: Object
  },

  innings: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    balls: [ballSchema]
  },

  // 🔥 UPDATED SCORE STRUCTURE (For both Innings)
  score: {
    inning1: { 
      runs: { type: Number, default: 0 }, 
      wickets: { type: Number, default: 0 }, 
      overs: { type: Number, default: 0 } 
    },
    inning2: { 
      runs: { type: Number, default: 0 }, 
      wickets: { type: Number, default: 0 }, 
      overs: { type: Number, default: 0 } 
    }
  },
  
  target: Number, // Chase karne ke liye target run

  winner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Team" 
  },

  battingStats: Array,
  bowlingStats: Array

}, { timestamps: true });

export default mongoose.model("Match", matchSchema);