import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
  createSlotDoctor,
  getTimeSlotDoctor,
  deleteSlotDoctor,
  getMyAppointment,
  updateBookingStatus,
} from "../Controllers/doctorController.js";
import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRoute from "./review.js";

const router = express.Router();

// Nested route
router.use("/:doctorId/reviews", reviewRoute);

// Routes
router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.put("/:id", authenticate, restrict(["doctor", "admin"]), updateDoctor);
router.delete("/:id", authenticate, restrict(["doctor", "admin"]), deleteDoctor);
router.get("/profile/me", authenticate, restrict(["doctor", "admin"]), getDoctorProfile);
router.post("/add-slot", authenticate, restrict(["admin", "doctor"]), createSlotDoctor);
router.get("/:id/slots", authenticate, restrict(["admin", "doctor"]), getTimeSlotDoctor);
router.delete("/:doctorId/delete-slot", authenticate, restrict(["admin", "doctor"]), deleteSlotDoctor);
router.get("/appointments/my-appointments", authenticate, restrict(["doctor"]), getMyAppointment);
router.put("/bookings/status", authenticate, restrict(["doctor"]), updateBookingStatus);
export default router;
