const User = require("../models/user");
const AdminSettings = require("../models/AdminSettings");
const Tournament = require("../models/Tournament");

/* ================= PROFILE ================= */

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

/* ================= SETTINGS ================= */

exports.getSettings = async (req, res) => {
  let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = await AdminSettings.create({});
  }

  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = new AdminSettings();
  }

  settings.defaultOvers = req.body.defaultOvers;
  settings.winPoints = req.body.winPoints;
  settings.autoFixture = req.body.autoFixture;
  settings.allowSelfRegistration = req.body.allowSelfRegistration;

  const updated = await settings.save();
  res.json(updated);
};

/* ================= DELETE ALL ================= */

exports.deleteAllTournaments = async (req, res) => {
  await Tournament.deleteMany({});
  res.json({ message: "All tournaments deleted successfully" });
};
