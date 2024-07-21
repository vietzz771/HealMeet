import mongoose from "mongoose";

const AchievementsSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Achievement", AchievementsSchema);
