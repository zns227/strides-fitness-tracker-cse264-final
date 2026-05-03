// User model - stores account info, password is hashed before saving to the database
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['beginner', 'expert', 'trainer'], default: 'beginner' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)