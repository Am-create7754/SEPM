import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Tournament from "./models/Tournament.js";
import Match from "./models/Match.js";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const pwd = "password123";

  // Create User 1
  const u1 = await User.create({ name: "User1", email: `u1_${Date.now()}@test.com`, password: pwd });
  // Create User 2
  const u2 = await User.create({ name: "User2", email: `u2_${Date.now()}@test.com`, password: pwd });

  // Create Tournament for User 1
  const t1 = await Tournament.create({ name: "User1 Tournament", createdBy: u1._id });

  // Now emulate GET /api/tournaments for User 2
  const user2Tournaments = await Tournament.find({ createdBy: u2._id });

  console.log(`User 2 Tournaments Count: ${user2Tournaments.length}`);

  if (user2Tournaments.length > 0) {
    console.error("DATA LEAK: User 2 sees User 1's tournament");
  } else {
    console.log("SUCCESS: User 2 does not see User 1's tournament");
  }

  process.exit(0);
})();
