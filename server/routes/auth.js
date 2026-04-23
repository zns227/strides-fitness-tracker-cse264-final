import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  const { name, username, email, password, role } = req.body
  try {
    const existingEmail = await User.findOne({ email })
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' })

    const existingUsername = await User.findOne({ username })
    if (existingUsername) return res.status(400).json({ message: 'Username already taken' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, username, email, password: hashed, role: role || 'beginner' })

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No token' })

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

// update password
router.put('/password', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No token' })

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { currentPassword, newPassword } = req.body
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: 'Password updated' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// update role
router.put('/role', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No token' })

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { role } = req.body
    if (!['beginner', 'expert'].includes(role)) return res.status(400).json({ message: 'Invalid role' })

    user.role = role
    await user.save()
    res.json({ message: 'Role updated', role: user.role })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router