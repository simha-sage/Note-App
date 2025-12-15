import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

function signToken(payload) {
  return jwt.sign(payload, "your_jwt_secret", { expiresIn: "7d" });
}

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });
    const token = signToken({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message || err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({
      message: "Logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

import Note from "../models/note.js";

router.post("/notes", authMiddleware, async (req, res) => {
  const { subject, content, visibility, type } = req.body;

  const note = await Note.create({
    subject,
    content,
    visibility,
    owner: req.user.id,
    type,
  });

  res.status(201).json(note);
});

router.get("/getNotes", authMiddleware, async (req, res) => {
  try {
    let query = {
      $or: [{ visibility: "ADMIN_ONLY" }, { owner: req.user.id }],
    };

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

router.get("/getAllNotes", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = {
      $or: [
        { visibility: { $ne: "PRIVATE" } }, // all non-private notes
        { owner: userId, visibility: "PRIVATE" }, // own private notes
      ],
    };

    const notes = await Note.find(query).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});
export default router;
