import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './db/mongo.js'
import authRoutes from './routes/auth.js'

const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.json())
app.use(cors())

connectDB()

app.use('/auth', authRoutes)

app.get('/up', (req, res) => res.json({ status: 'up' }))

app.listen(app.get('port'), () => {
  console.log('Server running on port', app.get('port'))
})