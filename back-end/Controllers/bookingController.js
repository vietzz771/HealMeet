import Booking from "../models/BookingSchema.js";

// Tạo booking mới
export const createBooking = async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json({
      status: true,
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message,
    });
  }
};

// Lấy tất cả bookings
export const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("doctor user clinic");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy booking theo ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("doctor user clinic");
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    res.json({ message: "Deleted booking" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
