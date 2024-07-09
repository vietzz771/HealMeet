import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";
import nodemailer from "nodemailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

export const register = async (req, res) => {
  const { name, email, password, gender, role, isApproved } = req.body;

  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    // check if user exists
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        gender,
        role,
      });
    }
    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        gender,
        role,
        isApproved,
      });
    }
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User successfully created." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error, Try again." });
  }
};

export const addAdmin = async (req, res) => {
  try {
    // Destructure user data from request body
    const { name, email, password, gender } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      role: "admin",
    });

    // Save the user to the database
    await newUser.save();

    // Return success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    // check if user exist or not
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    // get token
    const token = generateToken(user);

    const { password, role, appointments, ...rest } = user._doc;
    res.status(200).json({
      status: true,
      message: "Successfully login",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to login!" });
  }
};

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = generateRandomPassword();

      user = new User({
        name,
        email,
        password: randomPassword,
        picture,
        role: "patient",
      });
      await user.save();
    }

    const authToken = generateToken(user);
    res.status(200).json({
      status: true,
      message: "Successfully logged in with Google",
      token: authToken,
      data: user,
      role: user.role,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ message: "Invalid Google token" });
  }
};
//change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    let user = null;
    if (req.role === "patient") {
      user = await User.findById(req.userId);
    }
    else if (req.role === "admin") {
      user = await User.findById(req.userId);
    }
    else if (req.role === "superAdmin") {
      user = await User.findById(req.userId);
    }
     else if (req.role === "doctor") {
      user = await Doctor.findById(req.userId);
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// forgot password
// Function to send email
const sendEmail = async (email, newPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME, // Your Gmail username
      pass: process.env.MAIL_PASSWORD, // Your Gmail password
    },
  });
  console.log("process.env.EMAIL_USER", process.env.MAIL_USERNAME);
  console.log("process.env.EMAIL_USER", process.env.MAIL_USERNAME);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Forgot Password - Reset",
    text: `Your new password is: ${newPassword}`,
  };

  await transporter.sendMail(mailOptions);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password in database
    user.password = hashedPassword;
    await user.save();

    // Send email with new password
    await sendEmail(email, newPassword);

    res
      .status(200)
      .json({ message: "New password has been sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
