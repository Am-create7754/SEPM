import User from "../models/user.js";
import AdminSettings from "../models/AdminSettings.js";
import Tournament from "../models/Tournament.js";

/* ================= PROFILE ================= */

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    // req.user protect middleware se aata hai
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// CREATE PROFILE (Handle "CreateProfilePage")
export const createProfile = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mapping: Frontend 'role' -> Backend 'playerRole'
    // Taki system role (admin) change na ho jaye
    user.name = req.body.name || user.name;
    user.playerRole = req.body.role || user.playerRole; 
    user.batting = req.body.batting || user.batting;
    user.bowling = req.body.bowling || user.bowling;

    const updatedUser = await user.save();
    console.log("Profile Created/Updated for:", updatedUser.name);
    
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Backend Create Profile Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// UPDATE PROFILE (AdminSettings se Name/Role update ke liye)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    // Yahan agar admin settings se role change ho raha hai
    if (req.body.role) user.playerRole = req.body.role; 
    if (req.body.email) user.email = req.body.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Failed to update profile" });
  }
};

/* ================= SETTINGS ================= */

export const getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();

    if (!settings) {
      settings = new AdminSettings();
    }

    // Values update logic
    if (req.body.defaultOvers !== undefined) settings.defaultOvers = req.body.defaultOvers;
    if (req.body.winPoints !== undefined) settings.winPoints = req.body.winPoints;
    if (req.body.autoFixture !== undefined) settings.autoFixture = req.body.autoFixture;
    if (req.body.allowSelfRegistration !== undefined) settings.allowSelfRegistration = req.body.allowSelfRegistration;

    const updated = await settings.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

/* ================= DELETE ALL ================= */

export const deleteAllTournaments = async (req, res) => {
  try {
    await Tournament.deleteMany({});
    res.json({ message: "All tournaments deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete operation failed" });
  }
};