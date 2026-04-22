<<<<<<< HEAD
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
=======
import mongoose from 'mongoose'

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String },
  duration: { type: Number }, // in minutes
  exercises: [
    {
      name: { type: String },
      sets: { type: Number },
      reps: { type: Number },
      time: { type: Number }
    }
  ],
  date: { type: Date, default: Date.now }
})

export default mongoose.model('Workout', workoutSchema)
>>>>>>> feat/login
