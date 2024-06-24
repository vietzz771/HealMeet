import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import mongoose from "mongoose";
export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
    });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);
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

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");
    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No doctor found",
    });
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query;
    let doctors;
    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }
    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong, can't get" });
  }
};

export const createSlotDoctor = async (req, res) => {
  const { doctorId, date, startingTime, endingTime } = req.body;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    doctor.timeSlots.push({ date, startingTime, endingTime });
    await doctor.save();
    res.status(200).json({ message: "Time slot added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding time slot", error });
  }
};
export const getTimeSlotDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId).select("timeSlots");
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      message: "Time slots found",
      timeSlots: doctor.timeSlots,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching time slots", error });
  }
};
export const deleteSlotDoctor = async (req, res) => {
  const { doctorId } = req.params; // Lấy doctorId từ tham số đường dẫn

  // Kiểm tra doctorId có phải là ObjectId hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid doctorId" });
  }

  const { date, startingTime, endingTime } = req.body;

  try {
    // Tìm và cập nhật bác sĩ
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: doctorId },
      { $pull: { timeSlots: { date, startingTime, endingTime } } },
      { new: true }
    );

    // Kiểm tra xem bác sĩ có tồn tại không
    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    // Trả về thông báo thành công
    res
      .status(200)
      .json({ success: true, message: "Slot deleted successfully" });
  } catch (error) {
    // Xử lý lỗi và trả về thông báo lỗi
    console.error("Error deleting slot:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete slot", error });
  }
};
