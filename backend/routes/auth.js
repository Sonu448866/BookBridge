import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isUniversityEmail } from "../utils/emailValidator.js";
import { sendEmail, welcomeEmail } from "../utils/email.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1h",
  });
}

//register api
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, major, semester } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password required" });
    }

    if (!isUniversityEmail(email)) {
      return res
        .status(400)
        .json({ message: "Use your university email (@spit.ac.in)" });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      major: major || "",
      semester: semester || 1,
      isVerified: true,
    });

    sendEmail({
      to: user.email,
      subject: "Welcome to BookBridge",
      html: welcomeEmail(user.name),
    }).catch(() => {});

    res.status(201).json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        major: user.major,
        semester: user.semester,
        rating: user.rating,
        karmaPoints: user.karmaPoints,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//login api
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: signToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        major: user.major,
        semester: user.semester,
        rating: user.rating,
        karmaPoints: user.karmaPoints,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    major: req.user.major,
    semester: req.user.semester,
    rating: req.user.rating,
    karmaPoints: req.user.karmaPoints,
    isVerified: req.user.isVerified,
  });
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { major, semester, name } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (major !== undefined) user.major = major;
    if (semester) user.semester = semester;

    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      major: user.major,
      semester: user.semester,
      rating: user.rating,
      karmaPoints: user.karmaPoints,
      isVerified: user.isVerified,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
