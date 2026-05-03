import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'

// App is the root component - handles routing and holds the user state
function App() {
  // user state lives here so we can pass it down to any page that needs it
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        {/* if logged in go to dashboard, otherwise show login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* protected routes - redirect to login if no user */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={user ? <Contact /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App