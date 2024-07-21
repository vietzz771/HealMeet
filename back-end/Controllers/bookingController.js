import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: req.userId,
        box: JSON.stringify(req.body),
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/checkout-failed`,
      customer: customer.id,
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

    res.status(200).json({ success: true, message: "Successfully paid", session });
  } catch (error) {
    console.error("Error creating checkout session:", error); // Log the error
    res.status(500).json({ success: false, message: "Error creating checkout session", error: error.message });
  }
};

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

export const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("doctor user clinic");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
