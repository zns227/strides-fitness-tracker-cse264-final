// dashboard routes - stats, summary, suggestions, and weekly chart data
// proj requirement - "Internal REST API"
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Workout from "../models/Workout.js";

const router = express.Router();

// get body part stats for the past week
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const workouts = await Workout.find({
      userId: req.user.id,
      date: { $gte: oneWeekAgo }
    });
    // count how many times each body part was trained
    const stats = {};
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        stats[ex.bodyPart] = (stats[ex.bodyPart] || 0) + 1;
      });
    });
    res.json({ bodyPartStats: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// get total workout count for the user
router.get("/summary", requireAuth, async (req, res) => {
  try {
    const count = await Workout.countDocuments({
      userId: req.user.id
    });
    res.json({ totalWorkouts: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

// get exercise suggestions from ExerciseDB based on a body part
// proj requirement - "External REST API"
router.get("/suggestions", async (req, res) => {
  try {
    const { bodyPart } = req.query;
    const url = `https://oss.exercisedb.dev/api/v1/exercises?limit=200`;
    const response = await fetch(url);
    const json = await response.json();
    const exercises = json.data;
    if (!Array.isArray(exercises)) {
      return res.status(500).json({ error: "Unexpected API format", raw: json });
    }
    // filter by body part and return 6 random exercises
    const filtered = bodyPart
      ? exercises.filter(e => e.bodyParts?.[0]?.toLowerCase() === bodyPart.toLowerCase())
      : exercises;
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 6));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

// get weekly workout data grouped by day and body part (used for the chart)
router.get("/weekly", requireAuth, async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    const workouts = await Workout.find({
      userId: req.user.id,
      date: { $gte: sevenDaysAgo }
    });
    const result = {};
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    workouts.forEach(w => {
      const day = dayLabels[new Date(w.date).getDay()];
      if (!result[day]) result[day] = {};
      w.exercises.forEach(ex => {
        const part = ex.bodyPart || "unknown";
        result[day][part] = (result[day][part] || 0) + 1;
      });
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed weekly stats" });
  }
});

export default router;