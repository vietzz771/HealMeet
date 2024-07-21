import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clinic: {
      type: mongoose.Types.ObjectId,
      ref: "Clinic",
      // required: true,
    },
    userData: {
      type: Object,
      // required: true,
    },
    ticketPrice: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: Object,
      // required: true,
    },
    payment: {
      type: Object,
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "doctor",
    select: "name photo",
  });
  next();
});
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "clinic",
    select: "name location",
  });
  next();
});
export default mongoose.model("Booking", bookingSchema);
