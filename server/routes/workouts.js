import express from "express";
import Workout from "../models/Workout.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// post route to create a workout
router.post("/", requireAuth, async (req, res) => {
  const workout = await Workout.create({
    userId: req.session.user.id,
    exercises: req.body.exercises
  });

  res.json(workout);
});

// get request to see users workouts
router.get("/", requireAuth, async (req, res) => {
  const workouts = await Workout.find({
    userId: req.session.user.id
  });

  res.json(workouts);
});

export default router;