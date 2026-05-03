import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

// Login and Register page - handles both forms in one component
// ref: Lecture 24 (Oauth example), https://dev.to/fredabod/authentication-signup-and-login-with-expressmongodb-and-jwt-2n64
function Login({ setUser }) {
  // toggles between login and register mode
  const [isRegister, setIsRegister] = useState(false)

  // form field state - each input is a controlled component
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('beginner')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // handles login or register depending on which mode we're in
  const handleSubmit = async (e) => {
    e.preventDefault()

    // pick the right endpoint and body based on login vs register
    const endpoint = isRegister ? '/register' : '/login'
    const body = isRegister ? { name, username, email, password, role } : { email, password }

    // validation
    if (isRegister && password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    try {
      const res = await fetch(`http://localhost:3000/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message)

      // save the JWT token so we can use it for future API calls
      // ref: Lecture 22
      localStorage.setItem('token', data.token)

      // pass user data up to App.jsx via the setUser prop
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-brand">
        <img src="/gym.svg" alt="Strides logo" className="login-logo" />
        <h1 className="login-title">Strides</h1>
        <p className="login-subtitle">Your personal fitness tracker</p>
      </div>

      <div className="login-container">
        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* these fields only show up when registering */}
          {isRegister && (
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="name" />
            </div>
          )}
          {isRegister && (
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="username" />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {/* role select - this is how we handle the "User Accounts & Roles" project requirement */}
          {isRegister && (
            <div className="form-group">
              <label>I am a...</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>
        {/* toggle between login and register */}
        <p className="toggle-text">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button className="toggle-btn" onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? ' Log in' : ' Register'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login