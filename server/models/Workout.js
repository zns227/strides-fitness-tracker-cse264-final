import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: String,
  bodyPart: String,
  sets: Number,
  reps: Number,
  duration: Number
});

const workoutSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: { type: Date, default: Date.now },
  exercises: [exerciseSchema]
});

export default mongoose.model("Workout", workoutSchema);