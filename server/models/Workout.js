// Workout model - each workout belongs to a user and has a list of exercises
import mongoose from 'mongoose'

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Workout' },
  type: { type: String },
  duration: { type: Number },
  notes: { type: String },
  // each exercise is stored as a subdoc inside the workout
  exercises: [
      {
        name: { type: String },
        bodyPart: { type: String },
        sets: { type: Number },
        reps: { type: Number },
        duration: { type: Number }
      }
    ],
  date: { type: Date, default: Date.now }
})

export default mongoose.model('Workout', workoutSchema)