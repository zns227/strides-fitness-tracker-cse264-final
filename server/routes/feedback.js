import express from 'express'
import Feedback from '../models/Feedback.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, type, message } = req.body
  try {
    const feedback = await Feedback.create({ name, email, type, message })
    res.status(201).json({ message: 'Feedback submitted', feedback })
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback' })
  }
})

export default router