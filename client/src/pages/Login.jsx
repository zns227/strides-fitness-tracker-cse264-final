import { useState } from 'react'
import '../App.css'

function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('beginner')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const endpoint = isRegister ? '/auth/register' : '/auth/login'
    const body = isRegister ? { email, password, role } : { email, password }

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) return setError(data.message)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.location.href = '/dashboard'
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
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
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
        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button className="toggle-btn" onClick={() => { setIsRegister(!isRegister); setError('') }}>
            {isRegister ? ' Log in' : ' Register'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login