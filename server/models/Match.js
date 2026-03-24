import mongoose from "mongoose";

const ballSchema = new mongoose.Schema({
  runs: Number,
  extra: String,
  isWicket: Boolean,
  direction: String
});

const matchSchema = new mongoose.Schema({
  teamA: String,
  teamB: String,
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
  }

}, { timestamps: true });

export default mongoose.model("Match", matchSchema);