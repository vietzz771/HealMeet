import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
} from "../Controllers/doctorController.js";
import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRoute from "./review.js";

const router = express.Router();

// Nested route
router.use("/:doctorId/reviews", reviewRoute);

// Routes
router.get("/:id", authenticate, restrict(["admin"]), getSingleDoctor);
router.get("/", authenticate, restrict(["admin"]), getAllDoctor);
router.put("/:id", authenticate, restrict(["doctor", "admin"]), updateDoctor);
router.delete(
  "/:id",
  authenticate,
  restrict(["doctor", "admin"]),
  deleteDoctor
);
router.get(
  "/profile/me",
  authenticate,
  restrict(["doctor", "admin"]),
  getDoctorProfile
);

export default router;
