import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import teamRoutes from "./routes/teamRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";

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

// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});