import Achievement from "../models/AchievementsSchema.js";

export const updateAchievement = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedAchievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
    });
  }
};
export const createAchievement = async (req, res) => {
  try {
    const newAchievement = new Achievement(req.body);
    const savedAchievement = await newAchievement.save();
    res.status(201).json({
      success: true,
      message: "Achievement created successfully",
      data: savedAchievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create achievement",
      error: error.message,
    });
  }
};
export const deleteAchievement = async (req, res) => {
  const id = req.params.id;

  try {
    await Achievement.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

export const getSingleAchievement = async (req, res) => {
  const id = req.params.id;
  try {
    const Achievement = await Achievement.findById(id).select("-password");
    res.status(200).json({
      success: true,
      message: "Achievement found",
      data: Achievement,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No Achievement found",
    });
  }
};

export const getAllAchievement = async (req, res) => {
  try {
    const Achievements = await Achievement.find({});
    res.status(200).json({
      success: true,
      message: "Achievements found",
      data: Achievements,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getAchievementProfile = async (req, res) => {
  const AchievementId = req.AchievementId;
  try {
    const Achievement = await Achievement.findById(AchievementId);
    if (!Achievement) {
      return res
        .status(404)
        .json({ success: false, message: "Achievement not found" });
    }
    const { password, ...rest } = Achievement._doc;
    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong, can't get" });
  }
};
