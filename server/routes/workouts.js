import express from "express";
import Workout from "../models/Workout.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const workout = await Workout.create({
    userId: req.user.id,
    exercises: req.body.exercises
  });
  res.json(workout);
});

router.get("/", requireAuth, async (req, res) => {
  const workouts = await Workout.find({
    userId: req.user.id
  });
  res.json(workouts);
});

export default router;