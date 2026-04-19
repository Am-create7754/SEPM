import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import teamRoutes from "./routes/teamRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// routes
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/admin", adminRoutes); // 🔥 YE WALI LINE MISSING THI!
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// server start
// server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});