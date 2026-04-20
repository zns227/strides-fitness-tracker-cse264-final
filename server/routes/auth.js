import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashed,
    role
  });

  res.json(user);
});

// login post route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(400).json({ error: "Invalid password" });

  req.session.user = {
    id: user._id,
    role: user.role,
    username: user.username
  };

  res.json({ id: user._id, role: user.role });
});

// logout post route
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// get route for current user
router.get("/me", (req, res) => {
  res.json(req.session.user || null);
});

export default router;
