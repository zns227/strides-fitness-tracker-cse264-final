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