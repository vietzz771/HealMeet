import mongoose from "mongoose";
import DoctorSchema from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await DoctorSchema.findByIdAndUpdate(doctorId, {
    totalRating: stats.length > 0 ? stats[0].numOfRating : 0,
    averageRating: stats.length > 0 ? stats[0].avgRating : 0,
  });
};

reviewSchema.post(["save", "findOneAndUpdate"], async function (doc) {
  await doc.constructor.calcAverageRatings(doc.doctor);
});

export default mongoose.model("Review", reviewSchema);
