import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema({
  defaultOvers: { type: Number, default: 20 },
  winPoints: { type: Number, default: 2 },
  autoFixture: { type: Boolean, default: false },
  allowSelfRegistration: { type: Boolean, default: false },
});

export default mongoose.model("AdminSettings", adminSettingsSchema);