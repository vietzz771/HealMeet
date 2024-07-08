import {
  createBooking,
  getAllBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../Controllers/bookingController.js";

import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient", "admin"]), getBookingById);
router.get("/", getAllBooking);
router.put("/:id", authenticate, restrict(["admin"]), updateBooking);
router.delete("/:id", authenticate, restrict(["admin"]), deleteBooking);
router.post("/", authenticate, restrict(["patient", "admin"]), createBooking);

export default router;
