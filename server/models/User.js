<<<<<<< HEAD
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["beginner", "advanced"],
    default: "beginner"
  }
});

export default mongoose.model("User", userSchema);
=======
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['beginner', 'expert', 'trainer'], default: 'beginner' },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
>>>>>>> feat/login
