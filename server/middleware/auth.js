// middleware that checks if the user is logged in before letting them access a route
// ref: https://expressjs.com/en/guide/using-middleware.html
import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'No token provided' })

  try {
    // grab the token and verify it
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // attach user info to the request so routes can use it
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}