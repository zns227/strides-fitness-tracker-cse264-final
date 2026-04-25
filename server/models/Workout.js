import mongoose from 'mongoose'

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Workout' }, 
  type: { type: String },
  duration: { type: Number }, // in minutes
  notes: { type: String },
  exercises: [
      {
        name: { type: String },
        bodyPart: { type: String },
        sets: { type: Number },
        reps: { type: Number },
        time: { type: Number }
      }
    ],
  date: { type: Date, default: Date.now }
})

export default mongoose.model('Workout', workoutSchema)
