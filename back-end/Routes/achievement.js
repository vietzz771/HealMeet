import express from "express";
import {
  updateAchievement,
  deleteAchievement,
  getSingleAchievement,
  getAllAchievement,
  getAchievementProfile,
  createAchievement,
} from "../Controllers/achievementController.js";
import { authenticate } from "../auth/verifyToken.js";
const router = express.Router();
// Update an achievement by ID
router.put("/:id", updateAchievement);
router.post("/", createAchievement);

// Delete an achievement by ID
router.delete("/:id", deleteAchievement);

// Get a single achievement by ID
router.get("/:id", getSingleAchievement);

// Get all achievements
router.get("/", getAllAchievement);

// Get the profile of a specific achievement (assuming achievementId is passed in req)
router.get("/profile/:id", getAchievementProfile);

export default router;
