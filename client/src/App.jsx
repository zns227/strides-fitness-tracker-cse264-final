import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App