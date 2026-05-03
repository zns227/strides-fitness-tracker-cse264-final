// workout routes - create and get workouts for the logged in user
import express from "express";
import Workout from "../models/Workout.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// save a new workout
router.post("/", requireAuth, async (req, res) => {
  const workout = await Workout.create({
    userId: req.user.id,
    exercises: req.body.exercises,
    notes: req.body.notes
  });
  res.json(workout);
});

// get all workouts for this user
router.get("/", requireAuth, async (req, res) => {
  const workouts = await Workout.find({
    userId: req.user.id
  });
  res.json(workouts);
});

export default router;