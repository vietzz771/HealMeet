import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `http://localhost:5173/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });
    await booking.save();
    res.status(200).json({ success: true, message: "Successfully paid", session });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating checkout session" });
  }
};
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

export const cancelBooking = async (req, res) => {
  const { id } = req.body;
  try {
    const booking = await Booking.findById(id);
    if (booking == null) {
      return res.status(404).json({ message: "Cannot find booking" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.status(200).json({
      status: true,
      message: "Booking cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
