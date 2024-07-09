import {
  getClinicById,
  getClinics,
  deleteClinic,
  updateClinic,
  createClinic,
} from "../Controllers/clinicController.js";
import express from "express";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient", "admin"]), getClinicById);
router.get("/", getClinics);
router.put("/:id", authenticate, restrict(["admin"]), updateClinic);
router.delete("/:id", authenticate, restrict(["admin"]), deleteClinic);
router.post("/", authenticate, restrict(["admin"]), createClinic);

export default router;
