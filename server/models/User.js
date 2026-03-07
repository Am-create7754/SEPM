const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["player", "organiser", "admin"],
    default: "player",
  },
});

module.exports = mongoose.model("User", userSchema);
