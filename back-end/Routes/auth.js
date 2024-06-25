import express from "express";
import {
  register,
  login,
  addAdmin,
  googleLogin,
  changePassword,
  forgotPassword,
} from "../Controllers/authController.js";
import { authenticate } from "../auth/verifyToken.js";
const router = express.Router();
router.post("/google-login", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.post("/addAdmin", addAdmin);
router.put("/change-password", authenticate, changePassword);
router.post("/forgot-password", forgotPassword); // Add route for forgotPassword API

export default router;
