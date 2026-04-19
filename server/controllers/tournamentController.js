// import Tournament from "../models/Tournament.js";

// // @desc    Get all tournaments created by the logged-in user
// // @route   GET /api/tournaments
// export const getTournaments = async (req, res) => {
//   try {
//     // Check agar user authenticated hai
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const tournaments = await Tournament.find({ createdBy: req.user._id })
//       .populate("teams")
//       .sort({ createdAt: -1 });

//     // Hamesha array bhej rahe hain
//     res.status(200).json(tournaments || []);
//   } catch (error) {
//     console.error("Fetch Error:", error.message);
//     // Frontend .map() use karta hai, isliye error mein empty array bhej rahe hain
//     res.status(500).json([]); 
//   }
// };

// // @desc    Create a new tournament
// // @route   POST /api/tournaments
// export const createTournament = async (req, res) => {
//   try {
//     const { name, teams, matches } = req.body;

//     if (!name) {
//       return res.status(400).json({ message: "Tournament name zaroori hai" });
//     }

//     const newTournament = new Tournament({
//       name,
//       teams: teams || [],
//       matches: matches || [],
//       createdBy: req.user._id 
//     });

//     const savedTournament = await newTournament.save();
//     res.status(201).json(savedTournament);
//   } catch (error) {
//     res.status(400).json({ message: "Tournament create nahi ho paya", error: error.message });
//   }
// };

// // @desc    Get single tournament details
// // @route   GET /api/tournaments/:id
// export const getTournamentById = async (req, res) => {
//   try {
//     const tournament = await Tournament.findOne({
//       _id: req.params.id,
//       createdBy: req.user._id 
//     }).populate("teams matches");

//     if (!tournament) {
//       return res.status(404).json({ message: "Tournament nahi mila" });
//     }

//     res.json(tournament);
//   } catch (error) {
//     console.error("Single Fetch Error:", error.message);
//     // Yahan [] nahi bhej sakte kyunki ye single object expect karta hai
//     res.status(500).json({ message: "Server Error" });
//   }
// };