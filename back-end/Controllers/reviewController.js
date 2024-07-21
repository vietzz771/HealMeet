import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

//get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json({ success: true, message: "Successful", data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const createReview = async (req, res) => {
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.userId;

  try {
    // Check if the user has already reviewed this doctor
    const existingReview = await Review.findOne({
      doctor: req.body.doctor,
      user: req.body.user,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this doctor" });
    }

    // Create a new review
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });
    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: savedReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const updateReview = async (req, res) => {
  try {
    const { reviewId, ...updateData } = req.body;

    if (!reviewId) {
      return res.status(400).json({ success: false, message: "Review ID is required" });
    }

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });

    if (!updatedReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, message: "Review updated successfully", data: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
