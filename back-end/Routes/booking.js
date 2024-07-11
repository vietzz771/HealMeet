import {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBooking,
  cancelBooking,
  getCheckoutSession,
} from "../Controllers/bookingController.js";

import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient", "admin"]), getBookingById);
router.get("/", getAllBooking);
router.put("/:id", authenticate, restrict(["admin"]), updateBooking);
router.put("/", authenticate, restrict(["patient", "admin"]), cancelBooking);
router.post("/", authenticate, restrict(["patient", "admin"]), createBooking);
router.post("/checkout-session/:doctorId", authenticate, restrict(["patient", "admin"]), getCheckoutSession);
export default router;
