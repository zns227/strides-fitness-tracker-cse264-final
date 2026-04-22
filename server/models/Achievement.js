import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  earnedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Achievement', achievementSchema)