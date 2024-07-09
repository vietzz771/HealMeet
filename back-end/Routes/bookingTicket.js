import {
  createBooking,
  deleteBooking,
  getBookings,
  // updateBooking,
} from "../Controllers/bookingTicketController.js";
import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Routes
router.post("/add-bookingTicket", createBooking);
router.get("/", getBookings);
// router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
export default router;
