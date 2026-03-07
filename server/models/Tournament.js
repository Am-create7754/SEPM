const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Tournament", tournamentSchema);
