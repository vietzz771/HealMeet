import {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBooking,
  cancelBooking,
  getCheckoutSession,
} from "../Controllers/bookingController.js";
import Booking from "../models/BookingSchema.js";
import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient", "admin"]), getBookingById);
router.get("/", getAllBooking);
router.put("/:id", authenticate, restrict(["admin"]), updateBooking);
router.put("/", authenticate, restrict(["patient", "admin"]), cancelBooking);
router.post("/", authenticate, restrict(["patient", "admin"]), createBooking);
router.post("/checkout-session/:doctorId", authenticate, restrict(["patient", "admin"]), getCheckoutSession);

// const endpointSecret = "whsec_e499a7e2fc9156dafba5614bac1e3b82e53b5b229d091f62ce25f0ab61966572";
let endpointSecret;
router.post("/webhook", express.raw({ type: "application/json" }), async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  let data;
  let eventType;

  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("webhook verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = request.body.data.object;
    eventType = request.body.type;
  }

  // handle the event
  if (eventType === "checkout.session.completed") {
    // const booking = new Booking({
    //   ...data.box,
    //   session: data.id,
    // });
    // await booking.save();
    stripe.customers
      .retrieve(data.customer, { apiKey: process.env.STRIPE_SECRET_KEY })
      .then((customer) => {
        const box = JSON.parse(customer.metadata.box);
        console.log(box);
        const booking = new Booking({
          ...box,
          session: data.id,
        });
        console.log(booking);
        booking.save();
      })
      .catch((err) => console.log(err.message));
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});
export default router;
